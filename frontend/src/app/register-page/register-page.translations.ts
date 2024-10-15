import { Translator } from "../../utils/language";

export const registerTranslations = new Translator({
    Title: {
        en: "Create an account",
        es: "Crear cuenta",
    },
    "Existing_account": {
        en: "Already have an account? Log in.",
        es: "¿Ya tienes una cuenta? Inicia sesión.",
    },
    "How_do_you_want_others_to_see_you": {
        en: "How do you want others to see you?",
        es: "¿Cómo quieres que te vean los demás?",
    },
} as const);
