import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../../plugins/swagger.js";
import { SafeType } from "../../../../../utils/typebox.js";
import {
    friendSchema,
    selfIdSchema,
    userSchema,
} from "../../../../../types/user.js";
import { decorators } from "../../../../../services/decorators.js";
import { sendOk } from "../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../services/database.js";
import {
    getSelfFriends,
    getUsersBlocked,
} from "../../../../../queries/dml.queries.js";

export default (async (fastify, _opts) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: selfIdSchema,
            tags: ["Blocking"] satisfies MelodleTagName[],
            summary: "Get all blocked users from another.",
            response: {
                200: SafeType.Array(
                    SafeType.Object({
                        ...SafeType.Pick(userSchema, [
                            "id",
                            "name",
                            "username",
                            "profilePictureId",
                        ]).properties,
                    })
                ),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
        },
        async handler(request, reply) {
            const queryResult = await runPreparedQuery(
                getUsersBlocked,
                request.params
            );

            const output = queryResult.map((row) => {
                return {
                    id: row.id,
                    name: row.name,
                    username: row.username,
                    profilePictureId: row.profilePictureId,
                };
            });

            return sendOk(reply, 200, output);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
