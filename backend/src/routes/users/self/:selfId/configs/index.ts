import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../utils/typebox.js";
import { MelodleTagNames } from "../../../../../plugins/swagger.js";
import { melodleGameConfig } from "../../../../../types/melodleConfigs.js";
import { decorators } from "../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../types/params.js";

export default (async (fastify) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            response: {
                200: SafeType.Array(melodleGameConfig, {
                    description: "All configurations from this user.",
                }),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary: "Get saved user configurations.",
            tags: ["Game configs"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            body: SafeType.Omit(melodleGameConfig, ["id"]),
            response: {
                200: melodleGameConfig,
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary: "Add a new configuration preset.",
            description: undefined,
            tags: ["Game configs"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.delete("/:melodleConfigId", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "melodleConfigId"]),
            response: {
                200: melodleGameConfig,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary: "Delete a configuration preset.",
            description: undefined,
            tags: ["Game configs"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.put("/:melodleConfigId", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "melodleConfigId"]),
            response: {
                200: melodleGameConfig,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary: "Update a configuration preset.",
            description: undefined,
            tags: ["Game configs"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
