import { Value } from "@sinclair/typebox/value";
import fastify, { FastifyReply, FastifyRequest } from "fastify";
import { jwtTokenContentSchema, User } from "../types/user.js";
import schemaReferences from "../types/schemaReferences.js";
import {
    CommonErrorName,
    CommonErrorToCode,
    sendError,
} from "../utils/errors.js";
import fastifyOauth2 from "@fastify/oauth2";

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
                await request.jwtVerify();
            } catch (err) {
                return reply.unauthorized(
                    `Invalid jwt token: ${request.headers.authorization}. ${message ?? ""}`
                );
            }
        };
    },
    /** Required that the schema has a 401 error and a selfId in params,
     * and check the selfId against the user's token.
     */
    authenticateSelf(message?: string) {
        return async function (
            request: FastifyRequest & { params: { selfId: User["id"] } },
            reply: FastifyReplyWithErrorCodes<"unauthorized">
        ) {
            message ??= "";
            try {
                const tokenContent = await request.jwtVerify();

                if (
                    !Value.Check(
                        jwtTokenContentSchema,
                        schemaReferences,
                        tokenContent
                    )
                ) {
                    return sendError(
                        reply,
                        "unauthorized",
                        "jwt token has the wrong payload" + message
                    );
                }

                if (request.params.selfId != tokenContent.id) {
                    return sendError(
                        reply,
                        "unauthorized",
                        `this is not you: ${request.params.selfId}, ${tokenContent.id}. ${message}`
                    );
                }
            } catch {
                return sendError(
                    reply,
                    "unauthorized",
                    `Invalid jwt token: ${request.headers.authorization}. ${message}`
                );
            }
        };
    },
} as const;
