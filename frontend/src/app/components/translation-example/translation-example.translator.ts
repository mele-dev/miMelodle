import { Translator } from "../../../utils/language";

export const translationExampleTranslator = new Translator({
    "Example key": {
        en: "This is an example text!",
        es: "Este es un texto de ejemplo.",
    },
    "Example interpolation key": {
       "en": (name: string) => `Hello, ${name}!` as const,
       "es": (name: string) => `¡Hola, ${name}!` as const,
    },
} as const);
