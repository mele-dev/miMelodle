import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../../../plugins/swagger.js";
import { SafeType } from "../../../../../../utils/typebox.js";
import { decorators } from "../../../../../../services/decorators.js";
import { sendOk, sendError } from "../../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../../services/database.js";
import { leaderboardSchema } from "../../../../../../types/leaderboard.js";
import {
    deleteRankingData,
    addUserToLeaderboard,
    getGlobalLeaderboard,
    getFriendsLeaderboard,
    updateScore,
} from "../../../../../../queries/dml.queries.js";
import { ParamsSchema } from "../../../../../../types/params.js";
import { MelodleGameSchema } from "../../../../../../types/melodle.js";
import { queryStringSchema } from "../../../../../../types/querystring.js";

export default (async (fastify, _opts) => {
    fastify.get("/", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            querystring: SafeType.Pick(queryStringSchema, ["gameMode"]),
            response: {
                200: leaderboardSchema,
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary: "Get friends leaderboard for a given game mode.",
            tags: ["Leaderboards"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const result = await runPreparedQuery(getFriendsLeaderboard, {
                ...request.params,
                ...request.query,
            });
            return sendOk(reply, 200, { leaderboard: result });
        },
    });

    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            body: SafeType.Pick(
                leaderboardSchema.properties.leaderboard.items,
                ["score", "mode"]
            ),
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            tags: ["Leaderboards"] satisfies MelodleTagName[],
            response: {
                201: SafeType.Pick(
                    leaderboardSchema.properties.leaderboard.items,
                    ["score", "mode"]
                ),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                    "forbidden",
                ]),
            },
            summary: "Creates a user's score and rank on the leaderboard.",
        },
        handler: async function (request, reply) {
            const query = await runPreparedQuery(addUserToLeaderboard, {
                selfId: request.params.selfId,
                score: request.body.score,
                mode: request.body.mode,
            });
            return sendOk(reply, 201, query[0]);
        },
    });

    fastify.put("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            body: SafeType.Pick(
                leaderboardSchema.properties.leaderboard.items,
                ["score"]
            ),
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameMode"]),
            tags: ["Leaderboards"] satisfies MelodleTagName[],
            response: {
                201: SafeType.Pick(
                    leaderboardSchema.properties.leaderboard.items,
                    ["score"]
                ),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                    "forbidden",
                ]),
            },
            summary: "Updates user's score.",
        },
        handler: async function (request: any, reply: any) {
            const query = await runPreparedQuery(updateScore, {
                ...request.params,
                ...request.body,
                ...request.params,
            });
            if (query.length === 0) {
                return sendError(reply, "badRequest", "Couldn't update.");
            }
            return sendOk(reply, 200, query[0]);
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
            summary: "Deletes user's score.",
        },
        handler: async function (request, reply) {
            const queryResult = await runPreparedQuery(deleteRankingData, {
                ...request.params,
                ...request.query,
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
