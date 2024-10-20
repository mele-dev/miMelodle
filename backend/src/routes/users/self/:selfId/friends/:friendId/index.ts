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
    deleteFriend,
    addNewFriend,
    getStatus,
    changeStatus,
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
            params: friendRelationShipSchema,
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
                    throw "Something went wrong, could not delete.";
            }
        },
    });

    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: friendRelationShipSchema,
            tags: ["Friends"] satisfies MelodleTagName[],
            response: {
                201: SafeType.Pick(friendSchema, ["status"]),
                ...SafeType.CreateErrors([
                    "badRequest",
                    "notFound",
                    "unauthorized",
                ]),
            },
            summary: "Sends a friend request",
        },
        handler: async function (request, reply) {
            const queryResult = await runPreparedQuery(
                addNewFriend,
                request.params
            );

            const currentStatus = await runPreparedQuery(
                getStatus,
                request.params
            );

            if (
                queryResult.length === 1 &&
                currentStatus[0].status === "pending"
            ) {
                return sendOk(reply, 201, { status: queryResult[0].status });
            }
            if (
                queryResult.length === 0 &&
                currentStatus[0].status === "accepted"
            ) {
                return sendError(
                    reply,
                    "badRequest",
                    "Already friends with this person."
                );
            }
            if (queryResult.length === 0) {
                return sendError(
                    reply,
                    "notFound",
                    "Could not find target user."
                );
            }
        },
    });

}) satisfies FastifyPluginAsyncTypebox;
