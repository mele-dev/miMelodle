import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagNames } from "../../../../plugins/swagger.js";
import { SafeType } from "../../../../utils/typebox.js";
import {
    friendRelationShipSchema,
    userSchema,
} from "../../../../types/user.js";
import { decorators } from "../../../../services/decorators.js";

const friendsRoutes: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(friendRelationShipSchema, ["userId"]),
            tags: ["Melodle", "Friends"] satisfies MelodleTagNames[],
            summary: "Get all friends from a user.",
            response: {
                200: SafeType.Array(
                    SafeType.Pick(userSchema, [
                        "id",
                        "name",
                        "username",
                        "profilePictureId",
                    ])
                ),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
};

export default friendsRoutes;
