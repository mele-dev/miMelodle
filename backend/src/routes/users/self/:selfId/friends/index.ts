import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { PopdleTagName } from "../../../../../plugins/swagger.js";
import { SafeType } from "../../../../../utils/typebox.js";
import {
    friendSchema,
    selfIdSchema,
    userSchema,
} from "../../../../../types/user.js";
import { decorators } from "../../../../../services/decorators.js";
import { sendOk } from "../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../services/database.js";
import { getSelfFriends } from "../../../../../queries/dml.queries.js";

const friendsRoutes: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: selfIdSchema,
            tags: ["Friends"] satisfies PopdleTagName[],
            summary: "Get all friends from a user.",
            response: {
                200: SafeType.Array(
                    SafeType.Object({
                        ...SafeType.Pick(userSchema, [
                            "id",
                            "name",
                            "username",
                            "profilePictureId",
                            "profilePictureFilename",
                        ]).properties,
                        ...SafeType.Pick(friendSchema, ["status"]).properties,
                        selfIsRequestSender: SafeType.Boolean(),
                    })
                ),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
        },
        async handler(request, reply) {
            const result = await runPreparedQuery(
                getSelfFriends,
                request.params
            );

            const output = result.map((row) => {
                if (row.userId === request.params.selfId) {
                    return {
                        id: row.user2Id,
                        name: row.name2,
                        username: row.username2,
                        profilePictureId: row.profilePictureId2,
                        profilePictureFilename: row.profilePictureFilename2,
                        status: row.status,
                        selfIsRequestSender: true,
                    };
                }
                return {
                    id: row.userId,
                    name: row.name1,
                    username: row.username1,
                    profilePictureId: row.profilePictureId1,
                    profilePictureFilename: row.profilePictureFilename1,
                    status: row.status,
                    selfIsRequestSender: false,
                };
            });

            return sendOk(reply, 200, output);
        },
    });
};

export default friendsRoutes;
