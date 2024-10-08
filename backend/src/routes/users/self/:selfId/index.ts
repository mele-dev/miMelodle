import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../utils/typebox.js";
import { selfIdSchema, userSchema } from "../../../../types/user.js";
import { MelodleTagName } from "../../../../plugins/swagger.js";
import { runPreparedQuery } from "../../../../services/database.js";
import {
    deleteUser,
    getSelfuser,
    updateUser,
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
                    profilePictureFile:
                        profilePictureSchema.properties.filename,
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
            return sendOk(reply, 200, userProfile[0]);
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
                SafeType.Pick(userSchema, [
                    "username",
                    "email",
                    "name",
                    "password",
                    "profilePictureId",
                ]),
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
                200: SafeType.Pick(userSchema, [
                    "username",
                    "email",
                    "name",
                    "password",
                    "profilePictureId",
                ]),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            tags: ["User CRUD", "User"] satisfies MelodleTagName[],
            summary: "Update your user information.",
        },
        handler: async function (request, reply) {
            await runPreparedQuery(updateUser, {
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
            const queryResult = await runPreparedQuery(
                deleteUser,
                request.params
            );

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
