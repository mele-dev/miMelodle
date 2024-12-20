import {
    FastifyPluginAsyncTypebox,
    TSchema,
} from "@fastify/type-provider-typebox";
import { typedEnv } from "../../types/env.js";
import { SafeType } from "../../utils/typebox.js";
import { PopdleTagName } from "../../plugins/swagger.js";
import {
    executeTransaction,
    runPreparedQuery,
} from "../../services/database.js";
import { decorators } from "../../services/decorators.js";
import {
    getFriendsSnapshot,
    getUsersSnapshot,
} from "../../queries/snapshots.queries.js";
import { friendSchema, User, userSchema } from "../../types/user.js";
import { sendOk } from "../../utils/reply.js";
import { isAxiosError } from "axios";
import { hardCodedSongs } from "../../hardcoded/hardCodedSongs.js";

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
                tags: ["TODO Schema", "Debug"] satisfies PopdleTagName[],
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
                tags: ["TODO Schema", "Debug"] satisfies PopdleTagName[],
                security: [],
            },
            async handler(_request, reply) {
                return reply.notImplemented();
            },
        });
    }

    fastify.post("/playground", {
        onRequest: [decorators.noSecurity],
        schema: {
            security: [],
            tags: ["Debug"] satisfies PopdleTagName[],
        },
        async handler(_request, reply) {
            try {
                return hardCodedSongs[0]
            } catch (e) {
                if (isAxiosError(e)) {
                    return reply.code(e.status ?? 269).send(e.response?.data);
                }

                return e;
            }
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
