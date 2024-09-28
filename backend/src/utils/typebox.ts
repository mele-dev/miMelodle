import {
    Static,
    TLiteral,
    TObject,
    TOmit,
    TPick,
    TSchema,
    TString,
    Type,
    SchemaOptions,
} from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import schemaReferences from "../types/schemaReferences.js";
import {
    CommonErrorCode,
    CommonErrorName,
    commonErrors,
    CommonErrorToCode,
} from "./errors.js";

// Redeclarations
const safeTypeOverrides = {
    /**
     * [Json] Constructs a type whose keys are Picked from a given type.
     * (From an override)
     */
    Pick<
        TTSchema extends TSchema,
        TProperties extends (keyof TTSchema["properties"])[] & string[],
    >(
        value: TTSchema,
        keys: TProperties,
        options?: SchemaOptions
    ): TPick<TTSchema, TProperties> {
        return Type.Pick(value, keys, options);
    },
    /**
     * [Json] Constructs a type whose keys are omitted from the given type
     * (From an override)
     */
    Omit<
        TTSchema extends TSchema,
        TProperties extends (keyof TTSchema["properties"])[] & string[],
    >(
        value: TTSchema,
        keys: TProperties,
        options?: SchemaOptions
    ): TOmit<TTSchema, TProperties> {
        return Type.Omit(value, keys, options);
    },
} as const satisfies { [_ in keyof typeof Type]?: unknown };

// Added functionality
const helpers = {
    /**
     * Adds example values to the schema, and checks if they are valid. If not,
     * throws an exception.
     */
    WithExamples<TTSchema extends TSchema>(
        schema: TTSchema,
        examples: Static<TTSchema>[]
    ) {
        const output = Type.Union([schema], { ...schema, examples });

        for (const example of output.examples) {
            Value.Assert(schema, schemaReferences, example);
        }

        return output;
    },
    /**
     * @summary
     * Returns an object mapping the code of every error name (or code) passed,
     * to an appropriate error message schema, following the standards of
     * fastifySensible.
     * @example
     * ; // ... In a route schema.
     * responses {
     *     200: SafeType.Any() // You still have to specify successfull schemas!
     *     // The line below automatically maps 400 and 404
     *     ...SafeType.CreateErrors(["badRequest", "notFound"]),
     *     // You could also write it like:
     *     ...SafeType.CreateErrors([400, 404]);
     * }
     */
    CreateErrors<TErrors extends (CommonErrorCode | CommonErrorName)[]>(
        errors: TErrors
    ): {
        [E in TErrors[number] as CommonErrorToCode<E>]: TObject<{
            statusCode: TLiteral<CommonErrorToCode<E>>;
            error: TString;
            message: TString;
        }>;
    } {
        type ErrorSchema = TObject<{
            statusCode: TLiteral<CommonErrorCode>;
            error: TString;
            message: TString;
        }>;

        const output = errors.reduce(
            (acc, error) => {
                const code =
                    typeof error === "string" ? commonErrors[error] : error;
                const schema = SafeType.Object({
                    statusCode: Type.Literal(code),
                    error: Type.String(),
                    message: Type.String(),
                }) satisfies ErrorSchema;

                return { ...acc, [code]: schema };
            },
            {} as Record<CommonErrorCode, ErrorSchema>
        );

        // I'm pretty sure this cast is necessary. If this function is buggy,
        // blame this. - cr
        return output as any;
    },
} as const;

/**
 * Safer variations of typebox types, and some helper functions.
 * If more flexibility is required, you can still call the original `Type`.
 * Many of these are just copied from Type, and the behaviour of all of them
 * is the same, only their typescript signatures are changed.
 */
export const SafeType = {
    ...Type,
    ...safeTypeOverrides,
    ...helpers,
} as Omit<typeof Type, keyof typeof safeTypeOverrides> &
    typeof safeTypeOverrides &
    typeof helpers;
