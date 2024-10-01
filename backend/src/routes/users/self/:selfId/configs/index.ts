import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../plugins/swagger.js";
import { decorators } from "../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../types/params.js";
import { userSchema } from "../../../../../types/user.js";
import { melodleGameConfig } from "../../../../../types/melodle.js";

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
            tags: ["Game configs"] satisfies MelodleTagName[],
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
            tags: ["Game configs"] satisfies MelodleTagName[],
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
            tags: ["Game configs"] satisfies MelodleTagName[],
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
            tags: ["Game configs"] satisfies MelodleTagName[],
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
                200: SafeType.Array(SafeType.Omit(melodleGameConfig, ["id"])),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary:
                "Ask for a configuration suggestion based off of the user's spotify information.",
            description:
                "TODO: Discuss whether we should ask for the id or "
                + "make the frontend fetch the data and pass it to us." ,
            tags: ["Game configs"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
