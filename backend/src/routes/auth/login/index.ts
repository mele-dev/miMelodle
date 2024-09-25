import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { UserSchema } from "../../../types/user.js";
import { runPreparedQuery } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";
import { loginUser } from "../../../queries/dml.queries.js";

const tokenSchema = Type.Object({
    jwtToken: Type.String(),
});

const auth: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.post("/", {
        schema: {
            body: SafeType.WithExamples(
                SafeType.Pick(UserSchema, ["email", "password"]),
                [
                    {
                        email: "ezponjares@gmail.com",
                        password: "Cris123!",
                    },
                ]
            ),
            response: {
                200: tokenSchema,
                ...SafeType.CreateErrors(["notFound"]),
            },
            security: [],
        },

        handler: async function (request, reply) {
            const result = await runPreparedQuery(loginUser, request.body);
            if (result.length !== 1) {
                return reply
                    .notFound("Wrong email or password");
            }
            const token = fastify.jwt.sign({ id: result[0].id });
            return reply.code(200).send({ jwtToken: token });
        },
    });
};

export default auth;
