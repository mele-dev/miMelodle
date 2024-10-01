import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import {
    JwtTokenContent,
    jwtTokenSchema,
    userSchema,
} from "../../../types/user.js";
import { runPreparedQuery } from "../../../services/database.js";
import { SafeType } from "../../../utils/typebox.js";
import { loginUser } from "../../../queries/dml.queries.js";
import {
    CommonErrorCode,
    Responses,
    sendError,
    sendOk,
} from "../../../utils/reply.js";
import { MelodleTagName } from "../../../plugins/swagger.js";
import { decorators } from "../../../services/decorators.js";

const auth: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.post("", {
        onRequest: [decorators.noSecurity],
        schema: {
            body: SafeType.WithExamples(
                SafeType.Pick(userSchema, ["email", "password"]),
                [
                    {
                        email: "juanaxlopez1@gmail.com",
                        password: "Juana123!",
                    },
                ]
            ),
            tags: ["Auth"] satisfies MelodleTagName[],
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
            type res = Responses<typeof reply>;
            type codes = keyof res;
            type goodCodes = Exclude<codes, CommonErrorCode>;

            if (result.length !== 1) {
                return sendError(reply, "notFound", "Wrong email or password");
            }

            const token = fastify.jwt.sign({
                id: result[0].id,
            } satisfies JwtTokenContent);

            return sendOk(reply, 200, { jwtToken: token, id: result[0].id })
        },
    });
};

export default auth;
