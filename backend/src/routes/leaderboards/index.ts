import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import {
    leaderboardSchema,
} from "../../types/leaderboard.js";
import { MelodleGameSchema } from "../../types/melodle.js";
import { decorators } from "../../services/decorators.js";
import { runPreparedQuery } from "../../services/database.js";
import {
    getLeaderboard,
} from "../../queries/dml.queries.js";
import { sendOk } from "../../utils/reply.js";
import { queryStringSchema } from "../../types/querystring.js";

const leaderboards: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/:gameMode", {
        onRequest: [decorators.noSecurity],
        schema: {
            querystring: SafeType.Pick(queryStringSchema, ["page", "pageSize"]),
            params: SafeType.Pick(MelodleGameSchema, ["gameMode"]),
            response: {
                200: leaderboardSchema,
                ...SafeType.CreateErrors([]),
            },
            summary: "Fetches global leaderboard information.",
            description: undefined,
            tags: ["Leaderboards"] satisfies MelodleTagName[],
            security: [],
        },
        async handler(request, reply) {
            const result = await runPreparedQuery(getLeaderboard, {
                gameMode: request.params.gameMode,
                ...request.query,
                filterByFriends: false,
            });
            return sendOk(reply, 200, { leaderboard: result });
        },
    });
};
export default leaderboards;
