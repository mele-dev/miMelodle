import { Value } from "@sinclair/typebox/value";
import { FastifyReply, FastifyRequest } from "fastify";
import { jwtTokenContentSchema, User } from "../types/user.js";
import {
    CommonErrorName,
    CommonErrorToCode,
    sendError,
} from "../utils/reply.js";

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
                sendError(
                    reply,
                    "unauthorized",
                    `Invalid jwt token: ${request.headers.authorization}. ${message ?? ""}`
                );
            }
        };
    },
    /**
     * Required that the schema has a 401 error and a selfId in params,
     * and check the selfId against the user's token.
     */
    authenticateSelf(message?: string) {
        return async function (
            request: FastifyRequest & {
                params: { readonly selfId: User["id"] };
            },
            reply: FastifyReplyWithErrorCodes<"unauthorized">
        ) {
            message ??= "";
            try {
                const tokenContent = await request.jwtVerify();

                if (
                    !Value.Check(
                        jwtTokenContentSchema,
                        tokenContent
                    )
                ) {
                    return sendError(
                        reply,
                        "unauthorized",
                        "Jwt token has the wrong payload. " + message
                    );
                }

                if (request.params.selfId !== tokenContent.id) {
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
    /**
     * Use this to explicitly state you do not wish to validate anything from
     * the request via decorators. That means security must be empty.
     */
    async noSecurity(
        _request: FastifyRequest & {
            routeOptions: { schema?: { security: readonly [] } };
        },
        _reply: FastifyReply
    ) {},
} as const;
