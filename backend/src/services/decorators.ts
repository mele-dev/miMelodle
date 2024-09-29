import { Value } from "@sinclair/typebox/value";
import { FastifyReply, FastifyRequest } from "fastify";
import { jwtTokenContentSchema, User } from "../types/user.js";
import schemaReferences from "../types/schemaReferences.js";
import {
    CommonErrorName,
    CommonErrorToCode,
    sendError,
} from "../utils/errors.js";

type FastifyReplyWithErrorCodes<TErrorName extends CommonErrorName> =
    FastifyReply & {
        routeOptions: {
            schema?: {
                response: { [_ in CommonErrorToCode<TErrorName>]: any };
            };
        };
    };

export const decorators = {
    authenticate(message?: string) {
        return async function (
            request: FastifyRequest,
            reply: FastifyReplyWithErrorCodes<"unauthorized">
        ) {
            try {
                reply.routeOptions.schema?.response;
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
            request: FastifyRequest & { params: { selfId: User["id"] } },
            reply: FastifyReplyWithErrorCodes<"unauthorized">
        ) {
            try {
                const tokenContent = await request.jwtVerify();

                Value.Assert(
                    jwtTokenContentSchema,
                    schemaReferences,
                    tokenContent
                );
                Value.Equal(request.params.selfId, tokenContent.id);
            } catch {
                return sendError(
                    reply,
                    "unauthorized",
                    `Invalid jwt token: ${request.headers.authorization}. ${message ?? ""}`
                );
            }
        };
    },
} as const;
