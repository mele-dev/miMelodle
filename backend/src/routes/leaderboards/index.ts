import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { PopdleTagName } from "../../plugins/swagger.js";
import { leaderboardSchema } from "../../types/leaderboard.js";
import { PopdleGameSchema } from "../../types/popdle.js";
import { decorators } from "../../services/decorators.js";
import { runPreparedQuery } from "../../services/database.js";
import { getLeaderboard } from "../../queries/dml.queries.js";
import { sendOk } from "../../utils/reply.js";
import { queryStringSchema } from "../../types/querystring.js";

const leaderboards: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/:gameMode", {
        onRequest: [decorators.noSecurity],
        schema: {
            querystring: SafeType.Pick(queryStringSchema, ["page", "pageSize"]),
            params: SafeType.Pick(PopdleGameSchema, ["gameMode"]),
            response: {
                200: leaderboardSchema,
                ...SafeType.CreateErrors([]),
            },
            summary: "Fetches global leaderboard information.",
            description: undefined,
            tags: ["Leaderboards"] satisfies PopdleTagName[],
            security: [],
        },
        async handler(request, reply) {
            const result = await runPreparedQuery(getLeaderboard, {
                gameMode: request.params.gameMode,
                ...request.query,
                filterByFriends: false,
            });
            return sendOk(reply, 200, {
                leaderboard: result,
                mode: request.params.gameMode,
                totalPages: result?.[0].totalPages ?? 0,
            });
        },
    });
};
export default leaderboards;
