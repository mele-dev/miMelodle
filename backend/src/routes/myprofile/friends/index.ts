import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
//import { query, runPreparedQuery } from "../../services/database.js";
//import { SafeType } from "../../utils/typebox.js";
//import { jwtTokenContentSchema, userSchema } from "../../types/user.js";
//import { deleteUser, updateUser } from "../../queries/dml.queries.js";
//import { sendError } from "../../utils/errors.js";
//import { MelodleTagNames } from "../../plugins/swagger.js";
import { Value } from "@sinclair/typebox/value";
import { request } from "http";
import { SafeType } from "../../../utils/typebox.js";
import { friendSchema, userSchema } from "../../../types/user.js";
import { MelodleTagNames } from "../../../plugins/swagger.js";

const friendsRoutes: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.delete("/:username", {
        onRequest: fastify.authenticate,
        schema: {
            params: SafeType.Pick(userSchema, ["username"]),
            response: {
                200: SafeType.Pick(userSchema, ["username"]),
                ...SafeType.CreateErrors(["badRequest", "notFound"]),
            },
            tags: ["Friends", "Melodle"] satisfies MelodleTagNames[],
        },
        handler: async function (request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.post("/", {
        onRequest: fastify.authenticate,
        schema: {
            body: SafeType.WithExamples(
                SafeType.Pick(userSchema, ["username", "id"], {
                    description: "The username passed is the the friend to add's, and the id is yours.",
                }),
                [
                    {
                        username: "juanalopez1",
                        id: 1,
                    },
                ]
            ),
            tags: ["Friends", "Melodle"] satisfies MelodleTagNames[],
            response: {
                200: SafeType.Pick(userSchema, ["username"]),
                ...SafeType.CreateErrors(["badRequest", "notFound"]),
            },
        },
        handler: async function (request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.put('/:username', {
        onRequest: fastify.authenticate,
        schema: {
            body: SafeType.WithExamples(friendSchema, [
                {
                    username: 'juanalopez1',
                    status: 'blocked'
                }
            ]),
            tags: ["Friends", "Melodle"] satisfies MelodleTagNames[],
            response: {
                200: SafeType.Pick(friendSchema, ["status"]),
                ...SafeType.CreateErrors(["badRequest", "notFound"]),
            }
        },
        handler: async function (request, reply) {
            return reply.notImplemented();
        },
    })
};
