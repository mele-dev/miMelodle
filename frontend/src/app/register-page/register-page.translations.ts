import { Translator } from "../../utils/language";

export const registerTranslations = new Translator({
    title: {
        en: "Create an account",
        es: "Crear cuenta",
    },
    existingAccount: {
        en: "Already have an account? Log in.",
        es: "¿Ya tienes una cuenta? Inicia sesión.",
    },
    howDoYouWantOthersToSeeYou: {
        en: "How do you want others to see you?",
        es: "¿Cómo quieres que te vean los demás?",
    },
} as const);
