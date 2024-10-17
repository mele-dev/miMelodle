import {
    postAuthLoginBodyEmailMax,
    postAuthLoginBodyPasswordMax,
    postAuthRegisterBodyNameMax,
    postAuthRegisterBodyPasswordMin,
    postAuthRegisterBodyUsernameMax,
    postAuthRegisterBodyUsernameMin,
} from "../../apiCodegen/backend-zod";
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
        en: `A password must have between ${postAuthRegisterBodyPasswordMin} and ${postAuthLoginBodyPasswordMax} characters.`,
        es: `Una contraseña debe tener entre ${postAuthRegisterBodyPasswordMin} y ${postAuthLoginBodyPasswordMax} caracteres.`,
    },
    invalidRepeatPassword: {
        en: "Passwords do not match.",
        es: "Las contraseñas no coinciden.",
    },
    invalidName: {
        en: `Max name length is ${postAuthRegisterBodyNameMax}.` as const,
        es: `Máximo largo de nombre: ${postAuthRegisterBodyNameMax}.` as const,
    },
    invalidUsername: {
        en: {
            title: "A username must:",
            rules: [
                "Include only letters, digits, and '.', '-' or '_'",
                `Be between ${postAuthRegisterBodyUsernameMin} and ${postAuthRegisterBodyUsernameMax} characters.`,
            ],
        },
        es: {
            title: "Un nombre de usuario debe:",
            rules: [
                "Incluir unicamente letras, dígitos, y '.', '-' o '_'",
                `Tener entre ${postAuthRegisterBodyUsernameMin} y ${postAuthRegisterBodyUsernameMax} caracteres.`,
            ],
        },
    },
} as const);
