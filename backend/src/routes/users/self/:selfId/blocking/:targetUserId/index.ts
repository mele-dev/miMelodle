import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import {
    usersRelationShipSchema,
    friendSchema,
    userSchema,
    selfIdSchema,
} from "../../../../../../types/user.js";
import { PopdleTagName } from "../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../services/decorators.js";
import {
    blockAlreadyExists,
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
import TargetUserId from "../../friends/:targetUserId/index.js";

export default (async (fastify, _opts) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: usersRelationShipSchema,
            tags: ["Blocking"] satisfies PopdleTagName[],
            response: {
                201: SafeType.Object({
                    blocked: SafeType.Boolean(),
                    username: SafeType.String(),
                }),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                    "forbidden",
                ]),
            },
            summary: "Block a user.",
        },
        handler: async function (request, reply) {
            if (request.params.targetUserId === request.params.selfId) {
                return sendError(
                    reply,
                    "badRequest",
                    "You can't block yourself."
                );
            }

            const alreadyBlocked = await runPreparedQuery(
                blockAlreadyExists,
                request.params
            );

            if (alreadyBlocked.length > 0) {
                return sendError(
                    reply,
                    "badRequest",
                    "User already blocked or user has blocked you."
                );
            }

            const queryResult = await runPreparedQuery(
                blockUser,
                request.params
            );

            if (queryResult.length === 0) {
                return sendError(
                    reply,
                    "notFound",
                    "Could not find target user."
                );
            }

            const eraseFriend = await runPreparedQuery(
                deleteFriend,
                request.params
            );

            return sendOk(reply, 201, {
                blocked: true,
                username: queryResult[0].targetUsername
            });
        },
    });

    fastify.delete("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: usersRelationShipSchema,
            tags: ["Blocking"] satisfies PopdleTagName[],
            response: {
                200: SafeType.Object({
                    blocked: SafeType.Boolean(),
                    username: SafeType.String(),
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
                    return sendOk(reply, 200, {
                        blocked: false,
                        username: queryResult[0].targetUsername
                    });
                default:
                    throw "Something went wrong";
            }
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
