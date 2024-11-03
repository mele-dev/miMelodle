import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../types/params.js";
import {
    melodleGameConfig,
    MelodleGameSchema,
} from "../../../../../../types/melodle.js";
import { getRandomTrackFromArtists } from "../../../../../../spotify/helpers.js";
import { sendError, sendOk } from "../../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../../services/database.js";
import { createGuessLineGame } from "../../../../../../queries/dml.queries.js";

export default (async (fastify) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameId"]),
            response: {
                200: MelodleGameSchema,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary: "Get information about a melodle game.",
            description: undefined,
            tags: ["User"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            summary: "Start a new melodle game.",
            body: SafeType.Pick(melodleGameConfig, ["fromArtists"]),
            response: {
                201: SafeType.Pick(MelodleGameSchema, ["gameId"]),
                ...SafeType.CreateErrors([
                    "unauthorized",
                    "tooEarly",
                    "notFound",
                ]),
            },
            tags: ["Melodle"] satisfies MelodleTagName[],
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

            const queryResult = await runPreparedQuery(createGuessLineGame, {
                ...request.params,
                spotifyTrackId: track.track.id!,
                allowMultipleGamesADay: true,
            });

            console.info(queryResult);
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
