import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { ErrorMessageSchema, UserSchema } from "../../../types/user.js";
import { runPreparedQuery } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";
import { loginUser } from "../../../queries/dml.queries.js";

const tokenSchema = Type.Object({
    jwtToken: Type.String(),
});

const auth: FastifyPluginAsyncTypebox = async (fastify, opts) => {
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
                404: Type.Ref(ErrorMessageSchema),
            },
            security: [],
        },

        handler: async function (request, reply) {
            // FIXME
            // (The error from the line below also happens with just a raw query.)
            const result = await runPreparedQuery(loginUser, request.body);
            if (result.length !== 1) {
                return reply
                    .code(404)
                    .send({ errorMessage: "Wrong email or password" });
            }
            const token = fastify.jwt.sign({ id: result[0].id });
            return reply.code(200).send({ jwtToken: token });
        },
    });
};

export default auth;
