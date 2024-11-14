import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../../plugins/swagger.js";
import { SafeType } from "../../../../../utils/typebox.js";
import { decorators } from "../../../../../services/decorators.js";
import { sendOk } from "../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../services/database.js";
import { leaderboardSchema } from "../../../../../types/leaderboard.js";
import { addUserToLeaderboard } from "../../../../../queries/dml.queries.js";
import { ParamsSchema } from "../../../../../types/params.js";

export default (async (fastify, _opts) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            body: SafeType.Pick(
                leaderboardSchema.properties.leaderboard.items,
                ["score", "rank", "mode"]
            ),
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            tags: ["Leaderboards"] satisfies MelodleTagName[],
            response: {
                201: SafeType.Pick(
                    leaderboardSchema.properties.leaderboard.items,
                    ["score", "rank", "mode"]
                ),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                    "forbidden",
                ]),
            },
            summary: "",
        },
        handler: async function (request: any, reply: any) {
            // arreglar esos anys
            const query = await runPreparedQuery(addUserToLeaderboard, {
                selfId: request.params.selfId,
                score: request.body.score,
                rank: request.body.rank,
                mode: request.body.mode,
            });
            return sendOk(reply, 201, query[0]);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
