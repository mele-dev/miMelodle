import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { typedEnv } from "../../types/env.js";
import { SafeType } from "../../utils/typebox.js";
import { userSchema } from "../../types/user.js";
import { MelodleTagNames } from "../../plugins/swagger.js";
import { selectUsers } from "../../queries/dml.queries.js";
import { runPreparedQuery } from "../../services/database.js";

export default (async (fastify) => {
    if (typedEnv.NODE_ENV === "development") {
        fastify.get("/users", {
            schema: {
                security: [],
                summary: "Route to get all users",
                response: {
                    200: SafeType.Array(SafeType.Partial(userSchema)),
                },
                tags: ["Debug"] satisfies MelodleTagNames[],
            },
            async handler(_request, reply) {
                const users = await runPreparedQuery(selectUsers, {});
                return reply.code(200).send(
                    users.map((val) => ({
                        ...val,
                        spotifyId: val.spotifyId ?? undefined,
                    }))
                );
            },
        });
    }

}) satisfies FastifyPluginAsyncTypebox;
