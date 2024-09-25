import {
    FastifyPluginAsyncTypebox,
    Type,
} from "@fastify/type-provider-typebox";
import { ErrorMessageSchema, UserSchema } from "../../../types/user.js";
import { query, runPreparedQuery } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";
import { insertUser } from "../../../queries/dml.queries.js";

const tokenSchema = SafeType.Object({
    jwtToken: SafeType.String(),
});

const auth: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.post("/", {
        schema: {
            body: SafeType.WithExamples(
                SafeType.Omit(UserSchema, ["spotifyId", "id"]),
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
                200: tokenSchema,
                400: SafeType.Ref(ErrorMessageSchema),
            },
            security: [],
        },

        handler: async function (request, reply) {
            const body = request.body;
            const result = await runPreparedQuery(insertUser, body);
            if (result.length !== 1) {
                return reply
                    .code(400)
                    .send({ errorMessage: "Id already exists." });
            }
            const token = fastify.jwt.sign({ id: result[0].id });
            return reply.code(200).send({ jwtToken: token });
        },
    });
};

export default auth;
