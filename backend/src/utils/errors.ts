import fastifySensible from "@fastify/sensible";

/**
 * Map from every error in fastify sensible to their status code.
 * Made with AI, of course. - cr
 * See: {@link https://github.com/fastify/fastify-sensible?tab=readme-ov-file#api}
 */
export const commonErrors = {
    // Client Errors (4xx)
    badRequest: 400,
    unauthorized: 401,
    paymentRequired: 402,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    notAcceptable: 406,
    proxyAuthenticationRequired: 407,
    requestTimeout: 408,
    conflict: 409,
    gone: 410,
    lengthRequired: 411,
    preconditionFailed: 412,
    payloadTooLarge: 413,
    uriTooLong: 414,
    unsupportedMediaType: 415,
    rangeNotSatisfiable: 416,
    expectationFailed: 417,
    imateapot: 418,
    misdirectedRequest: 421,
    unprocessableEntity: 422,
    locked: 423,
    failedDependency: 424,
    tooEarly: 425,
    upgradeRequired: 426,
    preconditionRequired: 428,
    tooManyRequests: 429,
    requestHeaderFieldsTooLarge: 431,
    unavailableForLegalReasons: 451,

    // Server Errors (5xx)
    internalServerError: 500,
    notImplemented: 501,
    badGateway: 502,
    serviceUnavailable: 503,
    gatewayTimeout: 504,
    httpVersionNotSupported: 505,
    variantAlsoNegotiates: 506,
    insufficientStorage: 507,
    loopDetected: 508,
    bandwidthLimitExceeded: 509,
    notExtended: 510,
    networkAuthenticationRequired: 511,

    // This `satisfies` assertion proves everything is correct;
    // no hallucinations.
} as const satisfies {
    [K in fastifySensible.HttpErrorNames]: fastifySensible.HttpErrorCodes;
};

export type CommonErrors = typeof commonErrors;
export type CommonErrorName = keyof CommonErrors;
export type CommonErrorCode = CommonErrors[CommonErrorName];

export type CommonErrorToCode<
    TError extends CommonErrorName | CommonErrorCode,
> = TError extends CommonErrorName ? CommonErrors[TError] : TError;

export type FastifyError<TNumber extends number> = {
    statusCode: TNumber;
    error: string;
    message: string;
};
