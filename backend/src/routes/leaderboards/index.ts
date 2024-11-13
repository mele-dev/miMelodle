import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import {
    leaderBoardRangeSchema,
    leaderboardSchema,
} from "../../types/leaderboard.js";
import { gameModeArraySchema } from "../../types/melodle.js";
import { decorators } from "../../services/decorators.js";
import { runPreparedQuery } from "../../services/database.js";

const leaderboards: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/", {
        onRequest: [decorators.noSecurity],
        schema: {
            querystring: SafeType.Object({
                ...gamemodesch.properties,
                ...leaderBoardRangeSchema.properties,
            }),
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
            // const result = await runPreparedQuery(getglo, {
            //     ...request.query,
            //     username: request.query.query,
            //     rankThreshold: 0.15,
            // });
            // return sendOk(reply, 200, {
            //     matches: result,
            //     totalPages: result[0]?.totalPages ?? 0,
            // });
        },
    });
};
export default leaderboards;
