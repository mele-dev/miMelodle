import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import { leaderBoardRangeSchema, leaderboardSchema } from "../../types/leaderboard.js";
import { gameModeArraySchema } from "../../types/melodle.js";

export default (async (fastify) => {
    fastify.get("/", {
        onRequest: undefined,
        schema: {
            querystring: SafeType.Object({
                ...gameModeArraySchema.properties,
                ...leaderBoardRangeSchema.properties,
            }),
            response: {
                200: leaderboardSchema,
                ...SafeType.CreateErrors([]),
            },
            summary: "Fetches global leaderboard information.",
            description: undefined,
            tags: ["Leaderboards"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
