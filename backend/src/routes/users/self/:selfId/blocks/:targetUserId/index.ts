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

export default (async (fastify, _opts) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: usersRelationShipSchema,
            tags: ["Blocks"] satisfies MelodleTagName[],
            response: {
                201: SafeType.Object({ blocked: SafeType.Boolean() }),
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
            const alreadyBlocked = await runPreparedQuery(
                blockAlreadyExists,
                request.params
            );

            if (alreadyBlocked.length === 0) {
                const queryResult = await runPreparedQuery(
                    blockUser,
                    request.params
                );

                if (queryResult.length === 1) {
                    const eraseFriend = await runPreparedQuery(
                        deleteFriend,
                        request.params
                    );
                    if (eraseFriend.length === 1) {
                        return sendOk(reply, 201, {
                            blocked: true,
                        });
                    }
                } else {
                    return sendError(
                        reply,
                        "notFound",
                        "Could not find target user."
                    );
                }
            } else {
                return sendError(reply, "badRequest", "User already blocked or user has blocked you.");
            }
        },
    });

    fastify.delete("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: usersRelationShipSchema,
            tags: ["Blocks"] satisfies MelodleTagName[],
            response: {
                200: SafeType.Object({ blocked: SafeType.Boolean() }),
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
                    });
                default:
                    throw "Something went wrong";
            }
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
