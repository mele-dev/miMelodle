import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../utils/typebox.js";
import { friendRelationShipSchema, friendSchema, userSchema } from "../../../../../types/user.js";
import { MelodleTagNames } from "../../../../../plugins/swagger.js";
import { decorators } from "../../../../../services/decorators.js";

const friendsRoutes: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.delete("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: friendRelationShipSchema,
            response: {
                200: SafeType.Pick(userSchema, ["username"]),
                ...SafeType.CreateErrors(["badRequest", "notFound"]),
            },
            tags: ["Friends", "Melodle"] satisfies MelodleTagNames[],
            summary: "Removes a friend.",
            description:
                "This does not block them, and if they are blocked " +
                "it unblocks them. It transforms the friends into a normal " +
                "stranger.",
        },
        handler: async function (_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: friendRelationShipSchema,
            tags: ["Friends", "Melodle"] satisfies MelodleTagNames[],
            response: {
                200: SafeType.Pick(userSchema, ["username"]),
                ...SafeType.CreateErrors(["badRequest", "notFound"]),
            },
            summary: "Sends a friend request",
        },
        handler: async function (_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.put("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: friendRelationShipSchema,
            body: SafeType.Object({
                status: SafeType.StringEnum(["blocked", "accepted"]),
            }),
            tags: ["Friends", "Melodle"] satisfies MelodleTagNames[],
            response: {
                200: SafeType.Pick(friendSchema, ["status"]),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "preconditionRequired",
                ]),
            },
            summary: "Modifies an existing relationship with another user.",
            description:
                "## Rules\n" +
                "- If the user has a friend invite from a user, they can accept it.\n" +
                "- They always can block a user, even if they are not in any sort of relationship.\n" +
                "- If they are the ones who blocked the other user, they can unblock by setting it to accepted.",
        },
        handler: async function (_request, reply) {
            return reply.notImplemented();
        },
    });
};

export default friendsRoutes;
