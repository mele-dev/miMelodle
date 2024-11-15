export const supportedLanguages = ["en", "es"] as const;
export const melodleGameModes = ["Guess Line", "Guess Song"];
export type MelodleGameMode = (typeof melodleGameModes)[number];
