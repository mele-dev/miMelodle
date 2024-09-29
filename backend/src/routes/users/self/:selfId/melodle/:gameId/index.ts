import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { MelodleTagNames } from "../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../types/params.js";

export default (async (fastify) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            response: {
                200: SafeType.Literal("TODO!"),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary: "Get information about a melodle game.",
            description: undefined,
            tags: ["TODO Schema"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        }
    });
}) satisfies FastifyPluginAsyncTypebox;
