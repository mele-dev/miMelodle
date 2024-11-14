import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import {
    leaderBoardRangeSchema,
    leaderboardSchema,
} from "../../types/leaderboard.js";
import { MelodleGameSchema } from "../../types/melodle.js";
import { decorators } from "../../services/decorators.js";
import { runPreparedQuery } from "../../services/database.js";
import { getGlobalLeaderboard } from "../../queries/dml.queries.js";
import { sendOk } from "../../utils/reply.js";

const leaderboards: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/", {
        onRequest: [decorators.noSecurity],
        schema: {
            querystring: SafeType.Pick(MelodleGameSchema, ["gameMode"]),
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
            const result = await runPreparedQuery(getGlobalLeaderboard, {
                gameMode: request.query.gameMode,
            });
            return sendOk(reply, 200, { leaderboard: result });
        },
    });
};
export default leaderboards;
