import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { MelodleTagNames } from "../../plugins/swagger.js";
import { leaderBoardRangeSchema, leaderboardSchema } from "../../types/leaderboard.js";
import { gameModeArraySchema } from "../../types/melodle.js";

export default (async (fastify) => {
    fastify.post("/", {
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
            tags: ["Leaderboards"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
