import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { JwtTokenContent, jwtTokenSchema, userSchema } from "../../../types/user.js";
import { runPreparedQuery } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";
import { insertUser } from "../../../queries/dml.queries.js";
import { sendError } from "../../../utils/errors.js";
import { MelodleTagNames } from "../../../plugins/swagger.js";


const auth: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.post("/", {
        schema: {
            body: SafeType.WithExamples(
                SafeType.Omit(userSchema, ["spotifyId", "id"]),
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
                200: SafeType.Ref(jwtTokenSchema),
                ...SafeType.CreateErrors(["badRequest"]),
            },
            security: [],
            tags: ["Auth"] satisfies MelodleTagNames[],
            summary: "Route to register a user.",
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

            return reply.code(200).send({ jwtToken: token });
        },
    });
};

export default auth;
