import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../../../plugins/swagger.js";
import { SafeType } from "../../../../../../utils/typebox.js";
import { decorators } from "../../../../../../services/decorators.js";
import { sendOk, sendError } from "../../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../../services/database.js";
import { leaderboardSchema } from "../../../../../../types/leaderboard.js";
import {
    deleteRankingData,
    getLeaderboard,
} from "../../../../../../queries/dml.queries.js";
import { ParamsSchema } from "../../../../../../types/params.js";
import { MelodleGameSchema } from "../../../../../../types/melodle.js";
import { queryStringSchema } from "../../../../../../types/querystring.js";
import { basePoints } from "../../../../../../services/score.js";

export default (async (fastify, _opts) => {
    fastify.get("/", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            querystring: SafeType.Pick(queryStringSchema, [
                "page",
                "pageSize",
                "gameMode",
            ]),
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            response: {
                200: leaderboardSchema,
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary: "Get friends leaderboard for a given game mode.",
            tags: ["Leaderboards"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const result = await runPreparedQuery(getLeaderboard, {
                ...request.params,
                ...request.query,
                filterByFriends: true,
            });
            return sendOk(reply, 200, {
                leaderboard: result,
                mode: request.query.gameMode,
                totalPages: result?.[0].totalPages,
            });
        },
    });

    fastify.delete("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            querystring: SafeType.Pick(queryStringSchema, ["gameMode"]),
            tags: ["Leaderboards"] satisfies MelodleTagName[],
            response: {
                200: SafeType.Pick(MelodleGameSchema, ["userId"]),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                ]),
            },
            summary: "Reset user's score.",
        },
        handler: async function (request, reply) {
            const queryResult = await runPreparedQuery(deleteRankingData, {
                ...request.params,
                ...request.query,
                baseScore: basePoints,
            });
            switch (queryResult.length) {
                case 0:
                    return sendError(
                        reply,
                        "notFound",
                        "Could not find such ranking in that game from this user."
                    );
                case 1:
                    return sendOk(reply, 200, {
                        userId: queryResult[0].userId,
                    });
                default:
                    throw "Something went wrong";
            }
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
