import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import {
    friendRelationShipSchema,
    friendSchema,
    userSchema,
} from "../../../../../../types/user.js";
import { MelodleTagName } from "../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../services/decorators.js";
import {
    blockExists,
    blockUser,
    deleteFriend,
    getStatus,
    unblockUser,
} from "../../../../../../queries/dml.queries.js";
import { runPreparedQuery } from "../../../../../../services/database.js";
import { request } from "http";
import { sendError, sendOk } from "../../../../../../utils/reply.js";
import { run } from "node:test";
import { parseBody } from "got";
import fastify from "fastify";

export default (async (fastify, _opts) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: friendRelationShipSchema,
            tags: ["Blocks"] satisfies MelodleTagName[],
            response: {
                201: SafeType.Object({message: SafeType.Literal('User blocked successfully.')}),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                    "forbidden"
                ]),
            },
            summary: "Block a user.",
        },
        handler: async function (request, reply) {

            const alreadyBlocked = await runPreparedQuery(blockExists, request.params);

            if (alreadyBlocked.length === 0){
                const queryResult = await runPreparedQuery(
                    blockUser,
                    request.params
                );
    
                if (queryResult.length === 1) {
                    const eraseFriend = await runPreparedQuery(deleteFriend, request.params);
                    if (eraseFriend.length === 1){
                        return sendOk(reply, 201, { message: 'User blocked successfully.' });
                    }
                } else {
                    return sendError(
                        reply,
                        "notFound",
                        "Could not find target user."
                    );
                };
            } else {
                return sendError(
                    reply,
                    "forbidden",
                    "User already blocked."
                );
            }
            
        },
    });

    fastify.delete("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: friendRelationShipSchema,
            tags: ["Blocks"] satisfies MelodleTagName[],
            response: {
                204: SafeType.Object({
                    message: SafeType.Literal("Unblocked successfully!"),
                }),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                ]),
            },
            summary: "Unblock a user.",
        },
        handler: async function (request, reply) {

            const queryResult = await runPreparedQuery(
                unblockUser,
                request.params
            );
            
            switch (queryResult.length) {
                case 0:
                    return sendError(
                        reply,
                        "notFound",
                        "Could not find relationship with user."
                    );
                case 1:
                    return sendOk(reply, 204, {
                        message: "Unblocked successfully!",
                    });
                default:
                    throw "Something went wrong";
            }
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
