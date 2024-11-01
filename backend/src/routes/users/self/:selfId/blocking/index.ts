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
    getBlockedUsers,
    getSelfFriends,
} from "../../../../../queries/dml.queries.js";

export default (async (fastify, _opts) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: selfIdSchema,
            tags: ["Blocking"] satisfies MelodleTagName[],
            summary: "Get every user currently blocked by self.",
            response: {
                200: SafeType.Array(
                    SafeType.Object({
                        ...SafeType.Pick(userSchema, [
                            "id",
                            "name",
                            "username",
                            "profilePictureId",
                            "profilePictureFilename"
                        ]).properties,
                    })
                ),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
        },
        async handler(request, reply) {
            const queryResult = await runPreparedQuery(
                getBlockedUsers,
                request.params
            );

            return sendOk(reply, 200, queryResult);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
