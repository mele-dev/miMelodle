import { Static, TSchema } from "@sinclair/typebox";
import { MusixMatchStatusCode } from "../types/musixmatch.js";
import { Value } from "@sinclair/typebox/value";

/**
 * Represents the raw response structure from the MusixMatch API.
 */
export type RawMusixMatchResponse = {
    message: {
        body: unknown;
        header: {
            /**
             * Status code representing the result of the request.
             *
             * Possible values:
             * - `200`: The request was successful.
             * - `400`: The request had bad syntax or was inherently impossible to be satisfied.
             * - `401`: Authentication failed, probably because of invalid/missing API key.
             * - `402`: The usage limit has been reached, either you exceeded per day requests limits or your balance is insufficient.
             * - `403`: You are not authorized to perform this operation.
             * - `404`: The requested resource was not found.
             * - `405`: The requested method was not found.
             * - `500`: Oops. Something went wrong.
             * - `503`: Our system is a bit busy at the moment and your request can’t be satisfied.
             */
            status_code: MusixMatchStatusCode;
            /** Time taken to execute the request, in seconds */
            execute_time: number;
        };
    };
};

/**
 * Wrapper class for handling and validating responses from the MusixMatch API.
 * @template TTSchema - The TypeBox schema defining the expected structure for the response body when the response is successful.
 */
export class MusixMatchResponse<TTSchema extends TSchema> {
    /**
     * The headers of the MusixMatch API response, including the status code and execution time.
     */
    public headers: RawMusixMatchResponse["message"]["header"];

    /**
     * The body of the MusixMatch API response. Initially typed as `unknown`, but becomes `Static<TTSchema>` if parsed successfully.
     */
    public body: unknown;

    /**
     * Schema used for parsing and validating the response body.
     */
    public schema: TTSchema;

    /**
     * Constructs a MusixMatchResponse instance, extracting headers and body from the raw API response.
     * @param response - The raw response data from the MusixMatch API.
     * @param schema - The schema to validate the response body against.
     */
    constructor(response: RawMusixMatchResponse, schema: TTSchema) {
        this.headers = response.message.header;
        this.body = response.message.body;
        this.schema = schema;
    }

    /**
     * Parses and validates the response body against the provided schema if the response is successful.
     * Modifies `body` to be typed as `Static<TTSchema>` if parsing is successful.
     *
     * @returns `true` if parsing and validation are successful, `false` otherwise.
     */
    public parse(): this is MusixMatchResponse<TTSchema> & {
        body: Static<TTSchema>;
    } {
        if (this.isOk()) {
            this.body = Value.Parse(this.schema, this.body);
            return true;
        }

        return false;
    }

    /**
     * Determines if the response is successful (status code 200).
     * When true, `body` is expected to match `TTSchema`.
     *
     * @returns `true` if the status code is 200, indicating a successful response; otherwise, `false`.
     */
    public isOk(): this is { body: Static<TTSchema> } {
        return this.headers.status_code === 200;
    }

    /**
     * Validates that the response is successful, throwing an error if the status code is not 200.
     *
     * @param errorMessage - Custom error message to throw if the response status is not 200. Defaults to a generic message.
     * @throws Error - Throws an error with the provided message if the response is unsuccessful.
     * @returns The current `MusixMatchResponse` instance, with `body` typed as `Static<TTSchema>` if successful.
     */
    public expect(
        errorMessage?: string
    ): Static<TTSchema> {
        const code = this.headers.status_code;
        if (!this.isOk() || !this.parse()) {
            throw new Error(
                `Asserted ok when status is ${code}. ` + errorMessage,
                {
                    cause: this,
                }
            );
        }
        return this.body;
    }
}
