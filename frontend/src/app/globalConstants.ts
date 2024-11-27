export const supportedLanguages = ["en", "es"] as const;
export const popdleGameModes = ["guessLine", "guessSong"] as const;
export type PopdleGameMode = (typeof popdleGameModes)[number];
