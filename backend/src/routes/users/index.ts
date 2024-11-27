import {
    FastifyPluginAsyncTypebox,
    Static,
    TSchema,
} from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { User, userSchema } from "../../types/user.js";
import { PopdleTagName } from "../../plugins/swagger.js";
import { decorators } from "../../services/decorators.js";
import { friendSchema } from "../../types/user.js";
import { typedEnv } from "../../types/env.js";
import { runPreparedQuery } from "../../services/database.js";
import {
    searchForUserEmailOrUsername,
    searchUser,
} from "../../queries/dml.queries.js";
import { sendOk } from "../../utils/reply.js";
import { queryStringSchema } from "../../types/querystring.js";

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
            tags: ["User"] satisfies PopdleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.get("/search", {
        onRequest: [decorators.noSecurity],
        schema: {
            security: [],
            querystring: SafeType.Pick(queryStringSchema, [
                "query",
                "pageSize",
                "page",
            ]),
            tags: ["User"] satisfies PopdleTagName[],
            response: {
                200: SafeType.Object({
                    matches: SafeType.Array(
                        SafeType.Object({
                            ...SafeType.Pick(userSchema, [
                                "username",
                                "name",
                                "profilePictureFilename",
                                "id",
                                "profilePictureId",
                            ]).properties,
                            rank: SafeType.Number({
                                description:
                                    "Similarity ranking, from 0 to 1, 1 meaning equal.",
                            }),
                        }),
                        {
                            description:
                                "An array of near-matches, sorted from most relevant to least.",
                        }
                    ),
                    totalPages: SafeType.Number({
                        description:
                            "The total number of pages found with current sent query and page size.",
                    }),
                }),
            },
            summary: "Search users through their public information.",
        },
        async handler(request, reply) {
            const result = await runPreparedQuery(searchUser, {
                ...request.query,
                username: request.query.query,
                rankThreshold: 0.15,
            });

            return sendOk(reply, 200, {
                matches: result,
                totalPages: result[0]?.totalPages ?? 0,
            });
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
            tags: ["User"] satisfies PopdleTagName[],
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
