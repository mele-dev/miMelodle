import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../utils/typebox.js";
import { selfIdSchema, userSchema } from "../../../../types/user.js";
import { MelodleTagName } from "../../../../plugins/swagger.js";
import { runPreparedQuery } from "../../../../services/database.js";
import {
    deleteUser,
    getSelfuser,
    updateNonSensitiveUserData,
    updateSensitiveUserData,
} from "../../../../queries/dml.queries.js";
import { sendError, sendOk } from "../../../../utils/reply.js";
import { decorators } from "../../../../services/decorators.js";
import { profilePictureSchema } from "../../../../types/public.js";

const profile: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("", {
        onRequest: [
            decorators.authenticateSelf(
                "You must use a different route to get information from someone else."
            ),
        ],
        schema: {
            params: selfIdSchema,
            response: {
                200: SafeType.Object({
                    ...SafeType.Pick(userSchema, [
                        "username",
                        "email",
                        "name",
                        "id",
                    ]).properties,
                    spotifyId: SafeType.Optional(
                        userSchema.properties.spotifyId
                    ),
                    profilePictureFile:
                        profilePictureSchema.properties.filename,
                    profilePictureId: profilePictureSchema.properties.id,
                }),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            tags: ["User CRUD", "User"] satisfies MelodleTagName[],
            summary: "Get your user information.",
            description:
                "This is the route that exposes the most information about a user.",
        },

        async handler(request, reply) {
            const userProfile = await runPreparedQuery(
                getSelfuser,
                request.params
            );
            return sendOk(reply, 200, {
                ...userProfile[0],
                spotifyId: userProfile[0].spotifyId ?? undefined,
            });
        },
    });

    fastify.put("", {
        onRequest: [
            decorators.authenticateSelf("You cannot modify someone else."),
        ],
        schema: {
            params: SafeType.WithExamples(selfIdSchema, [
                {
                    selfId: 1,
                },
            ]),
            body: SafeType.WithExamples(
                SafeType.Object({
                    ...SafeType.Pick(userSchema, [
                        "username",
                        "email",
                        "name",
                        "profilePictureId",
                    ]).properties,
                    sensitive: SafeType.Optional(
                        SafeType.Pick(userSchema, ["oldPassword", "password"])
                    ),
                }),
                [
                    {
                        username: "juanchoTanca",
                        email: "juanchoTanca@gmail.com",
                        name: "juancho",
                        profilePictureId: 1,
                        sensitive: {
                            password: "Pepe123!",
                            oldPassword: "Juancho123!!",
                        },
                    },
                ]
            ),
            response: {
                200: SafeType.Object({
                    ...SafeType.Pick(userSchema, [
                        "username",
                        "email",
                        "name",
                        "profilePictureId",
                    ]).properties,
                    sensitive: SafeType.Optional(
                        SafeType.Pick(userSchema, ["oldPassword", "password"])
                    ),
                }),
                ...SafeType.CreateErrors(["unauthorized", "badRequest"]),
            },
            tags: ["User CRUD", "User"] satisfies MelodleTagName[],
            summary: "Update your user information.",
        },
        handler: async function (request, reply) {
            if (request.body.sensitive) {
                await runPreparedQuery(updateSensitiveUserData, {
                    ...request.body,
                    ...request.body.sensitive,
                    ...request.params,
                });
            }

            await runPreparedQuery(updateNonSensitiveUserData, {
                ...request.body,
                ...request.params,
            });

            return sendOk(reply, 200, request.body);
        },
    });

    fastify.delete("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: selfIdSchema,
            body: SafeType.Pick(userSchema, ["password"]),
            response: {
                200: SafeType.Pick(userSchema, ["username"]),
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            tags: ["User CRUD"] satisfies MelodleTagName[],
            summary:
                "Delete your own user and all their associated information.",
            description:
                "The cascading deletion will be more thoroughly " +
                "implemented once other resources are implemented.",
        },
        handler: async function (request, reply) {
            const queryResult = await runPreparedQuery(deleteUser, {
                ...request.params,
                ...request.body,
            });

            switch (queryResult.length) {
                case 0:
                    return sendError(
                        reply,
                        "notFound",
                        "Could not delete person with such credentials."
                    );
                case 1:
                    return sendOk(reply, 200, {
                        username: queryResult[0].username,
                    });
                default:
                    throw `Deleted ${queryResult.length} rows.`;
            }
        },
    });
};

export default profile;
