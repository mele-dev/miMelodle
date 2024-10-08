import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { typedEnv } from "../../types/env.js";
import { SafeType } from "../../utils/typebox.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import {
    executeTransaction,
    runPreparedQuery,
} from "../../services/database.js";
import { deleteUser, selectUsers } from "../../queries/dml.queries.js";
import { decorators } from "../../services/decorators.js";
import {
    getFriendsSnapshot,
    getUsersSnapshot,
} from "../../queries/snapshots.queries.js";
import { friendSchema, User, userSchema } from "../../types/user.js";
import { sendOk } from "../../utils/reply.js";
import { TSchema } from "@geut/openapi-box";

export default (async (fastify) => {
    if (typedEnv.NODE_ENV === "development") {
        fastify.get("/snapshot", {
            onRequest: [decorators.noSecurity],
            schema: {
                response: {
                    200: SafeType.Object({
                        users: SafeType.Array(
                            SafeType.Object({
                                ...SafeType.Pick(userSchema, [
                                    "name",
                                    "email",
                                    "username",
                                    "profilePictureId",
                                ]).properties,
                                spotifyId: SafeType.Optional(
                                    userSchema.properties.spotifyId
                                ),
                            } satisfies { [K in keyof User]?: TSchema })
                        ),
                        friends: SafeType.Array(
                            SafeType.Object({
                                friendUsername: userSchema.properties.username,
                                userUsername: userSchema.properties.username,
                                createdAt: SafeType.String({
                                    format: "date-time",
                                }),
                                status: friendSchema.properties.status,
                            })
                        ),
                    }),
                    ...SafeType.CreateErrors([]),
                },
                summary: "Get current state of application.",
                description: undefined,
                tags: ["TODO Schema", "Debug"] satisfies MelodleTagName[],
                security: [],
            },
            async handler(_request, reply) {
                return await executeTransaction(async () => {
                    // TODO: Return every table (do once we review the db).
                    const users = await runPreparedQuery(getUsersSnapshot, {});
                    const friends = await runPreparedQuery(
                        getFriendsSnapshot,
                        {}
                    );
                    return sendOk(reply, 200, {
                        users: users.map((u) => ({
                            ...u,
                            spotifyId: u.spotifyId ?? undefined,
                        })),
                        friends: friends.map((f) => ({
                            ...f,
                            createdAt: f.createdAt.toUTCString(),
                        })),
                    });
                });
            },
        });
        fastify.put("/snapshot", {
            onRequest: [decorators.noSecurity],
            schema: {
                response: {
                    200: SafeType.Literal("TODO!"),
                    ...SafeType.CreateErrors([]),
                },
                summary: "Reset the application state to a certain snapshot.",
                description: undefined,
                tags: ["TODO Schema", "Debug"] satisfies MelodleTagName[],
                security: [],
            },
            async handler(_request, reply) {
                return reply.notImplemented();
            },
        });

        fastify.delete("/users", {
            onRequest: [decorators.noSecurity],
            schema: {
                response: {
                    200: SafeType.Array(SafeType.Partial(userSchema)),
                    ...SafeType.CreateErrors([]),
                },
                summary: "Delete all users.",
                description: undefined,
                tags: ["Debug"] satisfies MelodleTagName[],
                security: [],
            },
            async handler(_request, reply) {
                const users = await runPreparedQuery(selectUsers, {});

                const promises = users.map((user) =>
                    runPreparedQuery(deleteUser, { selfId: user.id })
                );

                await Promise.allSettled(promises);

                const usersAfterDeletion = await runPreparedQuery(
                    selectUsers,
                    {}
                );

                return sendOk(
                    reply,
                    200,
                    usersAfterDeletion.map((val) => ({
                        ...val,
                        spotifyId: val.spotifyId ?? undefined,
                    }))
                );
            },
        });

        fastify.put("/reinit", {
            onRequest: [decorators.noSecurity],
            schema: {
                response: {
                    200: SafeType.Literal("Done."),
                    ...SafeType.CreateErrors([]),
                },
                summary: "Delete db and rerun init. (TODO!)",
                description: undefined,
                tags: ["Debug"] satisfies MelodleTagName[],
                security: [],
            },
            async handler(_request, reply) {
                return reply.notImplemented();
            }
        });
    }
}) satisfies FastifyPluginAsyncTypebox;
