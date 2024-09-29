import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import { userSchema } from "./user.js";

export const musixmatchIdSchema = SafeType.Object({
    musixmatchId: SafeType.String(),
});

export const MelodleAttemptSchema = SafeType.Object({
    guessedSongId: musixmatchIdSchema.properties.musixmatchId,
});

export const MelodleGameSchema = SafeType.Object({
    userId: userSchema.properties.id,
    attempts: SafeType.Array(MelodleAttemptSchema, {}),
    ...SafeType.Partial(
        SafeType.Object({
            won: SafeType.Boolean(),
            endingTime: SafeType.String({ format: "date-time" }),
        })
    ).properties,
    won: SafeType.Optional(SafeType.Boolean()),
    endingTime: SafeType.Optional(SafeType.String({ format: "date-time" })),
    gameMode: SafeType.StringEnum(["Guess Line", "Guess Song"]),
});

export type MelodleGame = Static<typeof MelodleGameSchema>;
