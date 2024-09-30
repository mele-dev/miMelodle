import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import { userSchema } from "./user.js";

export const gameModes = ["Guess Line", "Guess Song"] as const;

export type GameMode = (typeof gameModes)[number];

export const musixmatchIdSchema = SafeType.Object({
    musixmatchId: SafeType.String({
        description:
            "Identifier which can be used to fetch artist data from musicmatch.",
    }),
});

export const MelodleAttemptSchema = SafeType.Object({
    guessedSongId: musixmatchIdSchema.properties.musixmatchId,
    guessedAt: SafeType.String({ format: "date-time" }),
});

export const MelodleGameSchema = SafeType.Object({
    userId: userSchema.properties.id,
    gameId: SafeType.Integer({
        description: "A unique identifier for a melodle game.",
    }),
    attempts: SafeType.Array(MelodleAttemptSchema, {}),
    ...SafeType.Partial(
        SafeType.Object({
            won: SafeType.Boolean(),
            endingTime: SafeType.String({ format: "date-time" }),
        })
    ).properties,
    won: SafeType.Optional(SafeType.Boolean()),
    endingTime: SafeType.Optional(SafeType.String({ format: "date-time" })),
    gameMode: SafeType.StringEnum([...gameModes]),
});

export const gameModeArraySchema = SafeType.Object({
    gameModes: SafeType.Array(MelodleGameSchema.properties.gameMode),
});

export type MelodleGame = Static<typeof MelodleGameSchema>;
