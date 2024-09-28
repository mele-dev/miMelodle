import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
    JwtTokenContent,
    jwtTokenSchema,
    userSchema,
} from "../../../types/user.js";
import { runPreparedQuery } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";
import { loginUser } from "../../../queries/dml.queries.js";
import { sendError } from "../../../utils/errors.js";
import { MelodleTagNames } from "../../../plugins/swagger.js";

const auth: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.post("/", {
        schema: {
            body: SafeType.WithExamples(
                SafeType.Pick(userSchema, ["email", "password"]),
                [
                    {
                        email: "ezponjares@gmail.com",
                        password: "Cris123!",
                    },
                ]
            ),
            tags: ["Auth"] satisfies MelodleTagNames[],
            response: {
                200: SafeType.Intersect([
                    jwtTokenSchema,
                    SafeType.Pick(userSchema, ["id"]),
                ]),
                ...SafeType.CreateErrors(["notFound"]),
            },
            summary: "Fetch a user's jwt token.",
            security: [],
        },

        handler: async function (request, reply) {
            const result = await runPreparedQuery(loginUser, request.body);

            if (result.length !== 1) {
                return sendError(reply, "notFound", "Wrong email or password");
            }

            const token = fastify.jwt.sign({
                id: result[0].id,
            } satisfies JwtTokenContent);

            return { jwtToken: token, id: result[0].id };
        },
    });

    fastify.get('/verify', {
        onRequest: fastify.authenticate,
        schema: {
            response: {
                200: SafeType.Ref(jwtTokenSchema),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            tags: ["Auth"] satisfies MelodleTagNames[],
        },
        handler: async function (request,reply) {
            return reply.notImplemented();
        }
    })
};

export default auth;
