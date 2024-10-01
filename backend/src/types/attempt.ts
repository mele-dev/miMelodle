import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";

export const attemptSchema = SafeType.Object({
    attemptId: SafeType.Integer({
        description: "Identifier for an attempt.",
    }),
    attemptNumber: SafeType.Integer({
        description: "Quantity of attempts the user has made.",
        maximum: 6,
    }),
    resultAttempt: SafeType.Boolean(),
    attemptedAt: SafeType.String({
        format: "date-time",
        description: "Date of the attempt.",
    }),
});

const MelodleAttemptsSchema = SafeType.Array(attemptSchema);
export type AttemptType = Static<typeof attemptSchema>;
export type MelodleAttemptType = Static<typeof MelodleAttemptsSchema>;
