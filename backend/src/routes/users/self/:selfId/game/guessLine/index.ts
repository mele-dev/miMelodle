import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../types/params.js";
import {
    melodleGameConfig,
    MelodleGameSchema,
} from "../../../../../../types/melodle.js";
import { faker } from "@faker-js/faker";
import { getSeveralTracks } from "../../../../../../apiCodegen/spotify.js";
import { sendError, sendOk } from "../../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../../services/database.js";
import { insertGuessLineGame } from "../../../../../../queries/dml.queries.js";
import { getTrackLine } from "../../../../../../services/game.js";
import { hardCodedSettings } from "../../../../../../utils/settings.js";
import {
    getSeveralMaybeHardCodedTracks,
    getShuffledHardCodedSongs,
} from "../../../../../../hardcoded/hardCodedUtils.js";

export default (async (fastify) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            body: SafeType.Pick(melodleGameConfig, ["fromTracks"]),
            response: {
                201: SafeType.Pick(MelodleGameSchema, ["gameId"]),
                ...SafeType.CreateErrors([
                    "unauthorized",
                    "notFound",
                    "tooEarly",
                ]),
            },
            summary: "Start a new melodle game.",
            description: undefined,
            tags: ["Melodle"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const tracks = await getSeveralMaybeHardCodedTracks(
                request.body.fromTracks
            );

            const trackQueue = faker.helpers.shuffle(tracks);

            for (const track of trackQueue) {
                const isrc = track?.external_ids?.isrc;

                if (isrc === undefined) {
                    continue;
                }

                const line = await getTrackLine(isrc);

                if (line === null) {
                    continue;
                }

                const queryResult = await runPreparedQuery(
                    insertGuessLineGame,
                    {
                        ...request.params,
                        snippet: line,
                        spotifyTrackId: track.id!,
                        allowMultipleGamesADay: true,
                    }
                );

                if (!queryResult[0].canCreate) {
                    return sendError(
                        reply,
                        "tooEarly",
                        "You have already this game mode today."
                    );
                }

                return sendOk(reply, 201, {
                    gameId: queryResult[0].id,
                });
            }

            return sendError(
                reply,
                "notFound",
                "Could not find lyrics of given tracks."
            );
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
