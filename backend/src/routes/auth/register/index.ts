import {
    FastifyPluginAsyncTypebox,
} from "@fastify/type-provider-typebox";
import { UserSchema } from "../../../types/user.js";
import { runPreparedQuery } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";
import { insertUser } from "../../../queries/dml.queries.js";

const tokenSchema = SafeType.Object({
    jwtToken: SafeType.String(),
});

const auth: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
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
                ...SafeType.CreateErrors(["badRequest"]),
            },
            security: [],
        },

        handler: async function (request, reply) {
            const body = request.body;
            const result = await runPreparedQuery(insertUser, body);
            if (result.length !== 1) {
                return reply.unauthorized("Wrong email or password.");
            }
            const token = fastify.jwt.sign({ id: result[0].id });
            return reply.code(200).send({ jwtToken: token });
        },
    });
};

export default auth;
