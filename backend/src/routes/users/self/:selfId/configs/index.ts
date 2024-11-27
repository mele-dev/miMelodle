import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../utils/typebox.js";
import { PopdleTagName } from "../../../../../plugins/swagger.js";
import { decorators } from "../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../types/params.js";
import { userSchema } from "../../../../../types/user.js";
import { popdleGameConfig } from "../../../../../types/popdle.js";

export default (async (fastify) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            response: {
                200: SafeType.Array(popdleGameConfig, {
                    description: "All configurations from this user.",
                }),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary: "Get saved user configurations.",
            tags: ["Game configs"] satisfies PopdleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            body: SafeType.Omit(popdleGameConfig, ["id"]),
            response: {
                200: popdleGameConfig,
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary: "Add a new configuration preset.",
            description: undefined,
            tags: ["Game configs"] satisfies PopdleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.delete("/:popdleConfigId", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "popdleConfigId"]),
            response: {
                200: popdleGameConfig,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary: "Delete a configuration preset.",
            description: undefined,
            tags: ["Game configs"] satisfies PopdleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.put("/:popdleConfigId", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "popdleConfigId"]),
            response: {
                200: popdleGameConfig,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary: "Update a configuration preset.",
            description: undefined,
            tags: ["Game configs"] satisfies PopdleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.get("/suggest", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            querystring: SafeType.Pick(userSchema, ["spotifyId"]),
            response: {
                200: SafeType.Array(SafeType.Omit(popdleGameConfig, ["id"])),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary:
                "Ask for a configuration suggestion based off of the user's spotify information.",
            description:
                "TODO: Discuss whether we should ask for the id or "
                + "make the frontend fetch the data and pass it to us." ,
            tags: ["Game configs"] satisfies PopdleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
