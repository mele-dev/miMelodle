import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../plugins/swagger.js";
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
                "Gets information about the user's friends leaderboard on the game mode.",
            description: undefined,
            tags: ["Leaderboards"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
