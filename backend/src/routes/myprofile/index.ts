import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { query, runPreparedQuery } from "../../services/database.js";
import { SafeType } from "../../utils/typebox.js";
import { jwtTokenContentSchema, userSchema } from "../../types/user.js";
import { deleteUser, updateUser } from "../../queries/dml.queries.js";
import { sendError } from "../../utils/errors.js";
import { MelodleTagNames } from "../../plugins/swagger.js";
import { Value } from "@sinclair/typebox/value";

const profile: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.get("/:username", {
        onRequest: fastify.authenticate,
        schema: {
            params: SafeType.Object({
                username: userSchema.properties.username,
            }),
            tags: ["Melodle"] satisfies MelodleTagNames[]
        },

        async handler(request, reply) {
            const userProfile = await query(
                `SELECT * FROM users WHERE username=$1;`,
                [request.params.username]
            );
            return reply.code(200).send(userProfile);
        },
    });

    fastify.put("/:username", {
        onRequest: fastify.authenticate,
        schema: {
            params: SafeType.WithExamples(
                SafeType.Object({
                    username: userSchema.properties.username,
                }),
                [
                    {
                        username: "cristina",
                    },
                ]
            ),
            body: SafeType.WithExamples(
                SafeType.Omit(userSchema, ["id", "spotifyId"]),
                [
                    {
                        username: "juanchoTanca",
                        email: "juanchoTanca@gmail.com",
                        name: "juancho",
                        password: "Juancho123!",
                        profilePictureId: 1,
                    },
                ]
            ),
            response: {
                200: SafeType.Omit(userSchema, ["id", "spotifyId"]),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            tags: ["Melodle"] satisfies MelodleTagNames[]
        },
        handler: async function (request, reply) {
            const queryResult = await runPreparedQuery(updateUser, {
                ...request.body,
                oldUsername: request.params.username,
            });

            if (queryResult.length !== 1) {
                return sendError(
                    reply,
                    "unauthorized",
                    "You cannot modify someone else."
                );
            }

            return reply.code(200).send({
                ...request.body,
            });
        },
    });

    fastify.delete("/:username", {
        onRequest: fastify.authenticate,
        schema: {
            params: SafeType.Pick(userSchema, ["username"]),
            response: {
                200: SafeType.Pick(userSchema, ["username"]),
                ...SafeType.CreateErrors([401]),
            },
            tags: ["Melodle"] satisfies MelodleTagNames[]
        },
        handler: async function (request, reply) {
            Value.Assert(jwtTokenContentSchema, request.user);

            const queryResult = await runPreparedQuery(
                deleteUser,
                request.user
            );

            switch (queryResult.length) {
                case 0:
                    return reply.unauthorized(
                        "Could not delete person with such crentials."
                    );
                case 1:
                    return reply.code(200);
                default:
                    throw `Deleted ${queryResult.length} rows.`;
            }
        },
    });
};

export default profile;
