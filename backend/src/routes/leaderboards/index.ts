import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { jwtTokenSchema } from "../../types/user.js";
import { SafeType } from "../../utils/typebox.js";
import { MelodleTagNames } from "../../plugins/swagger.js";
import { createRangeSchema } from "../../types/rangeSchema.js";
import { leaderboardSchema } from "../../types/leaderboard.js";


const leaderboard: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/", {
        schema: {
            querystring: SafeType.WithExamples(createRangeSchema(50), [
                {
                    amount: 50,
                    start: 50
                }
            ]),
            response: {
                200: SafeType.Ref(leaderboardSchema),
                ...SafeType.CreateErrors(["badRequest"]),
            },
            security: [],
            tags: ["Leaderboards"] satisfies MelodleTagNames[],
            summary: "Route to get global leaderboard.",
            description:
                "Brings the global leaderboard, no matter gamemode.",
        },

        handler: async function (request, reply) {
            return reply.notImplemented();
        },
    });
};

export default leaderboard;
