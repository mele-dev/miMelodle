import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { MelodleTagNames } from "../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../types/params.js";
import {
    leaderBoardRangeSchema,
    leaderboardSchema,
} from "../../../../../../types/leaderboard.js";
import { gameModeArraySchema } from "../../../../../../types/melodle.js";

export default (async (fastify) => {
    fastify.get("/", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            querystring: SafeType.Object({
                ...leaderBoardRangeSchema.properties,
                ...gameModeArraySchema.properties,
            }),
            response: {
                200: leaderboardSchema,
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary:
                "Gets information about the user's friends leaderboard on the gamemode.",
            description: undefined,
            tags: ["Leaderboards"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
