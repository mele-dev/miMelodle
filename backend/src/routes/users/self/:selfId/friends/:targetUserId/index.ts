import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import {
    usersRelationShipSchema,
    friendSchema,
} from "../../../../../../types/user.js";
import { PopdleTagName } from "../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../services/decorators.js";
import {
    deleteFriend,
    addNewFriend,
    getStatus,
    acceptRequest,
    getRequestReceiver,
    isUserBlocked,
} from "../../../../../../queries/dml.queries.js";
import { query, runPreparedQuery } from "../../../../../../services/database.js";
import { sendError, sendOk } from "../../../../../../utils/reply.js";

export default (async (fastify, _opts) => {
    fastify.delete("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: usersRelationShipSchema,
            response: {
                200: SafeType.Pick(friendSchema, ["username"]),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                ]),
            },
            tags: ["Friends"] satisfies PopdleTagName[],
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
                    fastify.log.info(queryResult[0]);
                    return sendOk(reply, 200, {
                        username: queryResult[0].targetUsername,
                    });
                default:
                    throw `Something went wrong, deleted ${queryResult.length} users.`;
            }
        },
    });

    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: usersRelationShipSchema,
            tags: ["Friends"] satisfies PopdleTagName[],
            response: {
                201: SafeType.Pick(friendSchema, ["status", "username"]),
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
            const isBlocked = await runPreparedQuery(
                isUserBlocked,
                request.params
            );

            if (isBlocked.length > 0) {
                return sendError(
                    reply,
                    "forbidden",
                    "You cannot send a friend request to a user who has blocked you or to someone you blocked."
                );
            }

            const currentStatus = await runPreparedQuery(
                getStatus,
                request.params
            );
            if (currentStatus.length > 0) {
                return sendError(
                    reply,
                    "badRequest",
                    "Relationship already created."
                );
            }

            const queryResult = await runPreparedQuery(
                addNewFriend,
                request.params
            );
            if (queryResult.length === 1) {
                return sendOk(reply, 201, {
                    status: queryResult[0].status,
                    username: queryResult[0].targetUsername,
                });
            }

            return sendError(reply, "notFound", "Could not find target user.");
        },
    });

    fastify.put("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: usersRelationShipSchema,
            tags: ["Friends"] satisfies PopdleTagName[],
            response: {
                200: SafeType.Pick(friendSchema, ["status", "username"]),
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
                request.params.selfId === requestReceiver[0].user2Id
            ) {
                const result = await runPreparedQuery(acceptRequest, {
                    ...request.params,
                });

                return sendOk(reply, 200, {
                    status: result[0].status,
                    username: result[0].targetUsername,
                });
            }

            if (request.params.selfId !== requestReceiver[0].user2Id) {
                return sendError(
                    reply,
                    "forbidden",
                    "You are not allowed to accept this request."
                );
            }

            return sendError(
                reply,
                "badRequest",
                "Current or submitted status is invalid."
            );
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
