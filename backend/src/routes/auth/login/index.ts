import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { UserSchema } from "../../../types/user.js";
import { runPreparedQuery } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";
import { loginUser } from "../../../queries/dml.queries.js";
import { sendError } from "../../../utils/errors.js";

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
                ...SafeType.CreateErrors(["notFound"]),
            },
            security: [],
        },

        handler: async function (request, reply) {
            const result = await runPreparedQuery(loginUser, request.body);
            if (result.length !== 1) {
                const a = reply.routeOptions.schema?.response;
                return sendError(reply, "notFound", "Wrong email or password");
            }
            const token = fastify.jwt.sign({ id: result[0].id });
            return { jwtToken: token };
        },
    });
};

export default auth;
