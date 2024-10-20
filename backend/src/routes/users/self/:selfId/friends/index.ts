import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../../plugins/swagger.js";
import { SafeType } from "../../../../../utils/typebox.js";
import {
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
            tags: ["Friends"] satisfies MelodleTagName[],
            summary: "Get all friends from a user.",
            response: {
                200: SafeType.Array(
                    SafeType.Pick(userSchema, [
                        "id",
                        "name",
                        "username",
                        "profilePictureId",
                        "profilePictureFilename"
                    ])
                ),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
        },
        async handler(request, reply) {
            const result = await runPreparedQuery(
                getSelfFriends,
                request.params
            );

            const output = result.map((row: { userId: number; user2Id: any; name2: any; username2: any; profilePictureId2: any; profilePictureFilename2: any; name1: any; username1: any; profilePictureId1: any; profilePictureFilename1: any; }) => {
                if (row.userId == request.params.selfId){
                    return {
                        id: row.user2Id,
                        name: row.name2,
                        username: row.username2,
                        profilePictureId: row.profilePictureId2,
                        profilePictureFilename: row.profilePictureFilename2
                        
                    }
                }
                return {
                    id: row.userId,
                    name: row.name1,
                    username: row.username1,
                    profilePictureId: row.profilePictureId1,
                    profilePictureFilename: row.profilePictureFilename1
                    
                }
            })

            return sendOk(reply, 200, output);
        },
    });
};

export default friendsRoutes;
