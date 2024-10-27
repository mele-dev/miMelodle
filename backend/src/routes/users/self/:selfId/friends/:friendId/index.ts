import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import {
    usersRelationShipSchema,
    friendSchema,
    userSchema,
} from "../../../../../../types/user.js";
import { MelodleTagName } from "../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../services/decorators.js";
import {
    deleteFriend,
    addNewFriend,
    getStatus,
    changeStatus,
    getRequestReceiver,
    isUserBlocked,
} from "../../../../../../queries/dml.queries.js";
import { runPreparedQuery } from "../../../../../../services/database.js";
import { request } from "http";
import { sendError, sendOk } from "../../../../../../utils/reply.js";
import { run } from "node:test";
import { parseBody } from "got";

export default (async (fastify, _opts) => {
    fastify.delete("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: usersRelationShipSchema,
            response: {
                204: SafeType.Object({
                    message: SafeType.Literal("Deleted friend successfully!"),
                }),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                ]),
            },
            tags: ["Friends"] satisfies MelodleTagName[],
            summary: "Removes a friend.",
            description: "It transforms the friend into a normal stranger.",
        },
        handler: async function (request, reply) {
            const queryResult = await runPreparedQuery(
                deleteFriend,
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
                        message: "Deleted friend successfully!",
                    });
                default:
                    throw "Something went wrong, probably deleted more than 1 user.";
            }
        },
    });

    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: usersRelationShipSchema,
            tags: ["Friends"] satisfies MelodleTagName[],
            response: {
                201: SafeType.Pick(friendSchema, ["status"]),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                    "forbidden",
                ]),
            },
            summary: "Sends a friend request",
        },
        handler: async function (request, reply) {
            const allowedToSend = await runPreparedQuery(
                isUserBlocked,
                request.params
            );

            // primero chequeo que no este bloqueado
            if (allowedToSend.length === 0) {
                
                const currentStatus = await runPreparedQuery(
                    getStatus,
                    request.params
                );
                // chequeo que ya no haya una solicitud pendiente
                if (currentStatus.length === 0) {
                    const queryResult = await runPreparedQuery(
                        addNewFriend,
                        request.params
                    );
                    if (queryResult.length === 1) {
                        return sendOk(reply, 201, {
                            status: queryResult[0].status,
                        });
                    } else {
                        return sendError(
                            reply,
                            "notFound",
                            "Could not find target user."
                        );
                    }
                } else if (currentStatus[0].status === "accepted") {
                    return sendError(
                        reply,
                        "badRequest",
                        "Already friends with this person."
                    );
                }
            } else if (allowedToSend.length === 1) {
                return sendError(
                    reply,
                    "forbidden",
                    "You cannot send a friend request to a user who has blocked you or to someone you blocked."
                );
            }
        },
    });

    fastify.put("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: usersRelationShipSchema,
            body: SafeType.Object({
                status: SafeType.StringEnum(["accepted"]),
            }),
            tags: ["Friends"] satisfies MelodleTagName[],
            response: {
                202: SafeType.Pick(friendSchema, ["status"]),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "preconditionRequired",
                    "unauthorized",
                    "forbidden",
                ]),
            },
            summary: "It accepts a friend request.",
        },
        handler: async function (request, reply) {
            const currentStatus = await runPreparedQuery(
                getStatus,
                request.params
            );

            const requestReceiver = await runPreparedQuery(
                getRequestReceiver,
                request.params
            );

            if (
                currentStatus[0].status === "pending" &&
                request.body.status === "accepted" &&
                request.params.selfId === requestReceiver[0].user2Id
            ) {
                await runPreparedQuery(changeStatus, {
                    ...request.body,
                    ...request.params,
                });

                return sendOk(reply, 202, request.body);
            } else if (request.params.selfId !== requestReceiver[0].user2Id) {
                return sendError(
                    reply,
                    "forbidden",
                    "You are not allowed to accept this request."
                );
            } else {
                return sendError(
                    reply,
                    "badRequest",
                    "Current or submitted status is invalid."
                );
            }
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
