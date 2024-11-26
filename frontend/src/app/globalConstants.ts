export const supportedLanguages = ["en", "es"] as const;
export const melodleGameModes = ["guessLine", "guessSong"] as const;
export type MelodleGameMode = (typeof melodleGameModes)[number];
