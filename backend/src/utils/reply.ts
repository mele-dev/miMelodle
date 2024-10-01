import { FastifyReply } from "fastify";
import { reverseMap, ReverseMap } from "./utils.js";
import { Static } from "@sinclair/typebox";
import { TSchema } from "@sinclair/typebox";

// Error replies.

/**
 * Map from every error in fastify sensible to their status code.
 * Made with AI, of course. - cr
 * See: {@link https://github.com/fastify/fastify-sensible?tab=readme-ov-file#api}
 */
export const commonErrors = {
    // Client Errors (4xx)
    /** 400: The server cannot process the request due to a client error (e.g., malformed request syntax) */
    badRequest: 400,
    /** 401: The request requires user authentication */
    unauthorized: 401,
    /** 402: Reserved for future use. Originally intended for digital payment systems */
    paymentRequired: 402,
    /** 403: The server understood the request but refuses to authorize it */
    forbidden: 403,
    /** 404: The requested resource could not be found on the server */
    notFound: 404,
    /** 405: The method specified in the request is not allowed for the resource */
    methodNotAllowed: 405,
    /** 406: The resource is capable of generating only content not acceptable according to the Accept headers sent */
    notAcceptable: 406,
    /** 407: The client must first authenticate itself with the proxy */
    proxyAuthenticationRequired: 407,
    /** 408: The server timed out waiting for the request */
    requestTimeout: 408,
    /** 409: The request could not be completed due to a conflict with the current state of the target resource */
    conflict: 409,
    /** 410: The requested resource is no longer available and will not be available again */
    gone: 410,
    /** 411: The server refuses to accept the request without a defined Content-Length */
    lengthRequired: 411,
    /** 412: One or more preconditions given in the request header fields evaluated to false */
    preconditionFailed: 412,
    /** 413: The server is refusing to process a request because the request payload is larger than the server is willing or able to process */
    payloadTooLarge: 413,
    /** 414: The URI requested by the client is longer than the server is willing to interpret */
    uriTooLong: 414,
    /** 415: The server is refusing to service the request because the payload is in a format not supported */
    unsupportedMediaType: 415,
    /** 416: The client has asked for a portion of the file, but the server cannot supply that portion */
    rangeNotSatisfiable: 416,
    /** 417: The server cannot meet the requirements of the Expect request-header field */
    expectationFailed: 417,
    /** 418: Any attempt to brew coffee with a teapot should result in this error (April Fools' joke) */
    imateapot: 418,
    /** 421: The request was directed at a server that is not able to produce a response */
    misdirectedRequest: 421,
    /** 422: The request was well-formed but was unable to be followed due to semantic errors */
    unprocessableEntity: 422,
    /** 423: The resource that is being accessed is locked */
    locked: 423,
    /** 424: The request failed due to failure of a previous request */
    failedDependency: 424,
    /** 425: The server is unwilling to risk processing a request that might be replayed */
    tooEarly: 425,
    /** 426: The server refuses to perform the request using the current protocol but might be willing to do so after the client upgrades to a different protocol */
    upgradeRequired: 426,
    /** 428: The origin server requires the request to be conditional */
    preconditionRequired: 428,
    /** 429: The user has sent too many requests in a given amount of time ("rate limiting") */
    tooManyRequests: 429,
    /** 431: The server is unwilling to process the request because its header fields are too large */
    requestHeaderFieldsTooLarge: 431,
    /** 451: The server is denying access to the resource as a consequence of a legal demand */
    unavailableForLegalReasons: 451,

    // Server Errors (5xx)
    /** 500: The server encountered an unexpected condition that prevented it from fulfilling the request */
    internalServerError: 500,
    /** 501: The server does not support the functionality required to fulfill the request */
    notImplemented: 501,
    /** 502: The server, while acting as a gateway or proxy, received an invalid response from an inbound server */
    badGateway: 502,
    /** 503: The server is currently unable to handle the request due to temporary overloading or maintenance of the server */
    serviceUnavailable: 503,
    /** 504: The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server */
    gatewayTimeout: 504,
    /** 505: The server does not support, or refuses to support, the HTTP protocol version used in the request */
    httpVersionNotSupported: 505,
    /** 506: The server has an internal configuration error: the chosen variant resource is configured to engage in transparent content negotiation itself, and is therefore not a proper end point in the negotiation process */
    variantAlsoNegotiates: 506,
    /** 507: The server is unable to store the representation needed to complete the request */
    insufficientStorage: 507,
    /** 508: The server detected an infinite loop while processing the request */
    loopDetected: 508,
    /** 509: The server has exceeded the bandwidth limit that the server administrator has imposed */
    bandwidthLimitExceeded: 509,
    /** 510: Further extensions to the request are required for the server to fulfill it */
    notExtended: 510,
    /** 511: The client needs to authenticate to gain network access */
    networkAuthenticationRequired: 511,
    // This `satisfies` assertion proves everything is correct;
    // no hallucinations.
} as const satisfies {
    [key: string]: number;
};

export const codeToCommonErrors = reverseMap(commonErrors);

export type CommonErrors = typeof commonErrors;
export type CommonErrorName = keyof CommonErrors;
export type CommonErrorCode = CommonErrors[CommonErrorName];
export type CodeToErrors = ReverseMap<CommonErrors>;

export type CommonErrorToCode<
    TError extends CommonErrorName | CommonErrorCode,
> = TError extends CommonErrorName ? CommonErrors[TError] : TError;

export type CodeToCommonError<
    TError extends CommonErrorName | CommonErrorCode,
> = TError extends CommonErrorCode
    ? (typeof codeToCommonErrors)[TError]
    : TError;

export type FastifyError<TNumber extends number> = {
    statusCode: TNumber;
    error: string;
    message: string;
};

export type Responses<TReply extends FastifyReply> = NonNullable<
    NonNullable<TReply["routeOptions"]["schema"]>["response"]
>;

export function sendError<
    TCode extends keyof TResponses & CommonErrorCode,
    TReply extends FastifyReply,
    TResponses extends Responses<TReply>,
>(reply: TReply, code: TCode | CodeToCommonError<TCode>, message?: string) {
    const index = typeof code === "number" ? codeToCommonErrors[code] : code;
    return reply[index](message);
}

// Ok replies
export function sendOk<
    TCode extends Exclude<keyof TResponses, CommonErrorCode> & number,
    TReply extends FastifyReply,
    TResponses extends Responses<TReply> &
        Record<any, TSchema> = Responses<TReply>,
>(
    reply: TReply,
    code: TCode,
    value: Static<NoInfer<TResponses[TCode]>>
) {
    return reply.code(code).send(value as any);
}
