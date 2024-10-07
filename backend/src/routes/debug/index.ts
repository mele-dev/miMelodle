import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { typedEnv } from "../../types/env.js";
import { SafeType } from "../../utils/typebox.js";
import { userSchema } from "../../types/user.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import { deleteUser, selectUsers } from "../../queries/dml.queries.js";
import { runPreparedQuery } from "../../services/database.js";
import { decorators } from "../../services/decorators.js";
import { sendOk } from "../../utils/reply.js";

export default (async (fastify) => {
    if (typedEnv.NODE_ENV === "development") {
        fastify.get("/users", {
            onRequest: [decorators.noSecurity],
            schema: {
                security: [],
                summary: "Get all users",
                response: {
                    200: SafeType.Array(SafeType.Partial(userSchema)),
                },
                tags: ["Debug"] satisfies MelodleTagName[],
            },
            async handler(_request, reply) {
                const users = await runPreparedQuery(selectUsers, {});
                return sendOk(
                    reply,
                    200,
                    users.map((val) => ({
                        ...val,
                        spotifyId: val.spotifyId ?? undefined,
                    }))
                );
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
