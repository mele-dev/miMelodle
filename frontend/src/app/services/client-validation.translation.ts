import { postAuthLoginBodyEmailMax } from "../../apiCodegen/backend-zod";
import { Translator } from "../../utils/language";

export const validationTranslator = new Translator({
    wrongEmailLength: {
        en: `Max length is ${postAuthLoginBodyEmailMax}.`,
        es: `Máximo largo de ${postAuthLoginBodyEmailMax}.`,
    },
    invalidEmail: {
        en: "Invalid email.",
        es: "Correo electrónico inválido.",
    },
    invalidPassword: {
        en: (min: number, max: number) =>
            `A password must have between ${min} and ${max} characters.` as const,
        es: (min: number, max: number) =>
            `Una contraseña debe tener entre ${min} y ${max} caracteres.` as const,
    },
    invalidRepeatPassword: {
        en: "Passwords do not match.",
        es: "Las contraseñas no coinciden.",
    },
    invalidName: {
        en: (max: number) => `Max length is ${max}.` as const,
        es: (max: number) => `Máximo de ${max}.` as const,
    },
} as const);
