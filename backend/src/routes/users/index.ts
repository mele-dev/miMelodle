import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { runPreparedQuery } from "../../services/database.js";
import { selectUsers } from "../../queries/dml.queries.js";
import { SafeType } from "../../utils/typebox.js";
import { userSchema } from "../../types/user.js";
import { typedEnv } from "../../types/env.js";
import { MelodleTagNames } from "../../plugins/swagger.js";

const users: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    if (typedEnv.NODE_ENV === "development") {
        fastify.get("", {
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

    fastify.get("/:userId", {
        schema: {
            security: [],
            params: SafeType.Object({
                userId: userSchema.properties.id,
            }),
            response: {
                200: SafeType.Pick(userSchema, ["name", "username", "profilePictureFilename"]),
            },
            summary: "Get public information from some user.",
            description:
                "Authentication is not needed to see public user information.",
            tags: ["User"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
};

export default users;
