import {
    FastifyPluginAsyncTypebox,
    Static,
    TSchema,
} from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { User, userSchema } from "../../types/user.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import { decorators } from "../../services/decorators.js";
import { friendSchema } from "../../types/user.js";
import { typedEnv } from "../../types/env.js";
import { runPreparedQuery } from "../../services/database.js";
import { searchForUserEmailOrUsername } from "../../queries/dml.queries.js";
import { sendOk } from "../../utils/reply.js";

const users: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/:userId", {
        onRequest: [decorators.noSecurity],
        schema: {
            security: [],
            params: SafeType.Object({
                userId: userSchema.properties.id,
            }),
            response: {
                200: SafeType.Pick(userSchema, [
                    "name",
                    "username",
                    "profilePictureFilename",
                ]),
            },
            summary: "Get public information from some user.",
            description:
                "Authentication is not needed to see public user information.",
            tags: ["User"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.get("/search", {
        onRequest: [decorators.noSecurity],
        schema: {
            security: [],
            querystring: SafeType.Object({
                query: SafeType.String({
                    minLength: 3,
                    maxLength: 100,
                    description:
                        "Query to be used to search for users in the database.",
                }),
            }),
            tags: ["User"] satisfies MelodleTagName[],
            response: {
                200: SafeType.Array(
                    SafeType.Pick(userSchema, [
                        "username",
                        "name",
                        "profilePictureFilename",
                        "id",
                    ]),
                    {
                        maxItems: 50,
                        description:
                            "An array of near-matches, sorted from most relevant to least.",
                    }
                ),
            },
            summary: "Search users through their public information.",
        },

        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    const checkSchema = SafeType.Partial(
        SafeType.Pick(userSchema, ["username", "email"])
    );

    fastify.get("/check", {
        onRequest: [decorators.noSecurity],
        schema: {
            security: [],
            querystring: checkSchema,
            response: {
                200: SafeType.Object({
                    usernameExists: SafeType.Boolean(),
                    emailExists: SafeType.Boolean(),
                } satisfies Record<
                    `${keyof Static<typeof checkSchema>}Exists`,
                    TSchema
                >),
            },
            tags: ["User"] satisfies MelodleTagName[],
            summary: "Check if some user data already exists",
        },
        async handler(request, reply) {
            const result = await runPreparedQuery(
                searchForUserEmailOrUsername,
                request.query
            );

            return sendOk(reply, 200, {
                usernameExists: result.some(
                    (row) => row.username === request.query.username
                ),
                emailExists: result.some(
                    (row) => row.email === request.query.email
                ),
            });
        },
    });
};

export default users;
