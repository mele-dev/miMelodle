import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../utils/typebox.js";
import { MelodleTagNames } from "../../../../../plugins/swagger.js";

export default (async (fastify) => {
    fastify.get("", {
        onRequest: [],
        schema: {
            response: {
                200: SafeType.Literal("TODO!"),
                ...SafeType.CreateErrors([]),
            },
            summary: "Get saved user configurations.",
            description: undefined,
            tags: ["TODO Schema"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        }
    });
}) satisfies FastifyPluginAsyncTypebox;
