import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { typedEnv } from "../../types/env.js";
import { SafeType } from "../../utils/typebox.js";
import { userSchema } from "../../types/user.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import { selectUsers } from "../../queries/dml.queries.js";
import { runPreparedQuery } from "../../services/database.js";
import { decorators } from "../../services/decorators.js";
import { sendOk } from "../../utils/reply.js";

export default (async (fastify) => {
    if (typedEnv.NODE_ENV === "development") {
        fastify.get("/users", {
            onRequest: [decorators.noSecurity],
            schema: {
                security: [],
                summary: "Route to get all users",
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
    }
}) satisfies FastifyPluginAsyncTypebox;
