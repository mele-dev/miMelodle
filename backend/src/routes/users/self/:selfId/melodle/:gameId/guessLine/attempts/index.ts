import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../../../utils/typebox.js";
import { MelodleTagNames } from "../../../../../../../../plugins/swagger.js";

export default (async (fastify) => {
    fastify.post("", {
        onRequest: [],
        schema: {
            response: {
                200: SafeType.Literal("TODO!"),
                ...SafeType.CreateErrors([]),
            },
            summary: "Submit a guess for a melodle game.",
            description: undefined,
            tags: ["Juana"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        }
    });
}) satisfies FastifyPluginAsyncTypebox;
