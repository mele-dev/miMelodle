import { Value } from "@sinclair/typebox/value";
import { FastifyReply, FastifyRequest } from "fastify";
import { jwtTokenContentSchema, User } from "../types/user.js";
import schemaReferences from "../types/schemaReferences.js";

export const decorators = {
    authenticate(message?: string) {
        return async function (request: FastifyRequest, reply: FastifyReply) {
            try {
                await request.jwtVerify();
            } catch (err) {
                return reply.unauthorized(
                    `Invalid jwt token: ${request.headers.authorization}. ${message ?? ""}`
                );
            }
        };
    },
    authenticateSelf(message?: string) {
        return async function (
            request: FastifyRequest & { params: { userId: User["id"] } },
            reply: FastifyReply
        ) {
            try {
                const tokenContent = await request.jwtVerify();

                Value.Assert(
                    jwtTokenContentSchema,
                    schemaReferences,
                    tokenContent
                );
                Value.Equal(request.params.userId, tokenContent.id);
            } catch {
                return reply.unauthorized(
                    `Invalid jwt token: ${request.headers.authorization}. ${message ?? ""}`
                );
            }
        };
    },
} as const;
