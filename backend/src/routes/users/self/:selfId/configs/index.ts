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
    fastify.post("", {
        onRequest: [],
        schema: {
            response: {
                200: SafeType.Literal("TODO!"),
                ...SafeType.CreateErrors([]),
            },
            summary: "Add a new configuration preset.",
            description: undefined,
            tags: ["TODO Schema"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        }
    });
    fastify.delete("", {
        onRequest: [],
        schema: {
            response: {
                200: SafeType.Literal("TODO!"),
                ...SafeType.CreateErrors([]),
            },
            summary: "Delete a configuration preset.",
            description: undefined,
            tags: ["TODO Schema"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        }
    });
    fastify.put("", {
        onRequest: [],
        schema: {
            response: {
                200: SafeType.Literal("TODO!"),
                ...SafeType.CreateErrors([]),
            },
            summary: "Update a configuration preset.",
            description: undefined,
            tags: ["TODO Schema"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        }
    });
}) satisfies FastifyPluginAsyncTypebox;
