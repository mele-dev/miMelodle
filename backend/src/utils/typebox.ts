import {
    Static,
    TObject,
    TOmit,
    TPick,
    TSchema,
    Type,
} from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";
import schemaReferences from "../types/schemaReferences.js";

// Redeclarations
const safeTypeOverrides = {
    /**
     * [Json] Constructs a type whose keys are Picked from a given type.
     * (From an override)
     */
    Pick<
        TTSchema extends TSchema,
        TProperties extends (keyof TTSchema["properties"])[] & string[],
    >(value: TTSchema, keys: TProperties): TPick<TTSchema, TProperties> {
        return Type.Pick(value, keys);
    },
    /**
     * [Json] Constructs a type whose keys are omitted from the given type
     * (From an override)
     */
    Omit<
        TObj extends TObject,
        TProperties extends (keyof TObj["properties"])[] & string[],
    >(value: TObj, keys: TProperties): TOmit<TObj, TProperties> {
        return Type.Omit(value, keys);
    },
} as const satisfies { [K in keyof typeof Type]?: unknown };

// Added functionality
const helpers = {
    /**
     * Adds example values to the schema, and checks if they are valid. If not,
     * throws an exception.
     */
    WithExamples<TTSchema extends TSchema>(
        schema: TTSchema,
        examples: Static<TTSchema>[],
    ) {
        const output = Type.Union([schema], {...schema, examples});

        for (const example of output.examples) {
            Value.Assert(schema, schemaReferences, example);
        }

        return output;
    },
} as const;

/**
 * Safer variations of typebox types, and some helper functions.
 * If more flexibility is required, you can still call the original `Type`
 * (which is also a property of SafeType). Many of these are just copied from
 * Type, and the behaviour of all of them is the same, only their typescript
 * signatures are changed.
 */
export const SafeType = {
    ...Type,
    ...safeTypeOverrides,
    ...helpers,
} as Omit<typeof Type, keyof typeof safeTypeOverrides> &
    typeof safeTypeOverrides &
    typeof helpers;
