import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { PopdleTagName } from "../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../types/params.js";
import {
    popdleGameConfig,
    PopdleGameSchema,
} from "../../../../../../types/popdle.js";
import { getRandomTrackFromArtists } from "../../../../../../spotify/helpers.js";
import { sendError, sendOk } from "../../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../../services/database.js";
import { createGuessSongGame } from "../../../../../../queries/dml.queries.js";
import { getTrackSnippet } from "../../../../../../services/game.js";

export default (async (fastify) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            summary: "Start a new popdle game.",
            body: SafeType.Pick(popdleGameConfig, ["fromArtists"]),
            response: {
                201: SafeType.Pick(PopdleGameSchema, ["gameId"]),
                ...SafeType.CreateErrors([
                    "unauthorized",
                    "tooEarly",
                    "notFound",
                ]),
            },
            tags: ["Popdle"] satisfies PopdleTagName[],
        },
        async handler(request, reply) {
            const track = await getRandomTrackFromArtists({
                artistsIds: request.body.fromArtists,
                groups: ["album", "single"],
            });

            if (track === null) {
                return sendError(
                    reply,
                    "notFound",
                    "Could not find a track from those artists."
                );
            }

            const isrc = track.track.external_ids?.isrc;

            let snippet = !!isrc ? await getTrackSnippet(isrc) : null;

            const queryResult = await runPreparedQuery(createGuessSongGame, {
                ...request.params,
                spotifyTrackId: track.track.id!,
                allowMultipleGamesADay: true,
                snippet: snippet,
            });

            if (!queryResult[0].canCreate) {
                return sendError(
                    reply,
                    "tooEarly",
                    "You have already played this game mode today."
                );
            }

            return sendOk(reply, 201, {
                gameId: queryResult[0].id,
            });
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
