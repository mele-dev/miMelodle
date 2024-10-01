import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
    JwtTokenContent,
    jwtTokenSchema,
    userSchema,
} from "../../../types/user.js";
import { runPreparedQuery } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";
import { insertUser } from "../../../queries/dml.queries.js";
import { sendError, sendOk } from "../../../utils/reply.js";
import { decorators } from "../../../services/decorators.js";
import { MelodleTagName } from "../../../plugins/swagger.js";

const auth: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.post("", {
        onRequest: [decorators.noSecurity],
        schema: {
            body: SafeType.WithExamples(
                SafeType.Pick(userSchema, [
                    "username",
                    "profilePictureId",
                    "email",
                    "password",
                    "name",
                ]),
                [
                    {
                        username: "juanalopez1",
                        email: "juanaxlopez1@gmail.com",
                        name: "juana",
                        password: "Juana123!",
                        profilePictureId: 1,
                    },
                ]
            ),
            response: {
                200: SafeType.WithExamples(
                    SafeType.Object({
                        ...jwtTokenSchema.properties,
                        ...SafeType.Pick(userSchema, ["id"]).properties,
                    }),
                    [
                        {
                            jwtToken:
                                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzI3NDExODc4fQ.lCYmZF_REl8rYYj1UjJzacXrPCTyjVdA-KsR71xHwQw",
                            id: 2,
                        },
                    ]
                ),
                ...SafeType.CreateErrors(["badRequest"]),
            },
            security: [],
            tags: ["Auth", "User CRUD", "User"] satisfies MelodleTagName[],
            summary: "Create a user.",
            description:
                "Creates a new user with the given credentials if possible.",
        },

        handler: async function (request, reply) {
            const result = await runPreparedQuery(insertUser, request.body);

            if (result.length !== 1) {
                return sendError(
                    reply,
                    "badRequest",
                    "No se pudo crear el usuario."
                );
            }

            const token = fastify.jwt.sign({
                id: result[0].id,
            } satisfies JwtTokenContent);

            return sendOk(reply, 200, { jwtToken: token, id: result[0].id });
        },
    });
};

export default auth;
