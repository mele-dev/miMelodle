import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../utils/typebox.js";
import { MelodleGameSchema } from "../../../../types/melodle.js";
import { decorators } from "../../../../services/decorators.js";
import { ParamsSchema } from "../../../../types/params.js";
import { MelodleTagNames } from "../../../../plugins/swagger.js";

export default (async (fastify) => {
    fastify.post('', {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            summary: "Start a new melodle game.",
            body: SafeType.Pick(MelodleGameSchema, ["gameMode"]),
            response: {
                200: SafeType.Pick(MelodleGameSchema, ["gameId"]),
                ...SafeType.CreateErrors(["unauthorized", "tooEarly"]),
            },
            tags: ["Melodle"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        }
    });
}) satisfies FastifyPluginAsyncTypebox;
