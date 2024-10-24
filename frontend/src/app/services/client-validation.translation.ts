import { Injectable } from "@angular/core";
import {
    postAuthLoginBodyEmailMax,
    postAuthLoginBodyPasswordMax,
    postAuthRegisterBodyNameMax,
    postAuthRegisterBodyPasswordMin,
    postAuthRegisterBodyUsernameMax,
    postAuthRegisterBodyUsernameMin,
} from "../../apiCodegen/backend-zod";
import { Translations, TranslatorService } from "./translator.service";

export const validationDict = {
    wrongEmailLength: {
        en: `Max length is ${postAuthLoginBodyEmailMax}.`,
        es: `El máximo es de ${postAuthLoginBodyEmailMax} caracteres.`,
    },
    invalidEmail: {
        en: "Invalid email.",
        es: "Email inválido.",
    },
    invalidPassword: {
        en: `A password must have between ${postAuthRegisterBodyPasswordMin} and ${postAuthLoginBodyPasswordMax} characters.`,
        es: `La contraseña debe tener entre ${postAuthRegisterBodyPasswordMin} y ${postAuthLoginBodyPasswordMax} caracteres.`,
    },
    invalidRepeatPassword: {
        en: "Passwords do not match.",
        es: "Las contraseñas no coinciden.",
    },
    invalidName: {
        en: `A name must be between 1 and ${postAuthRegisterBodyNameMax} characters.` as const,
        es: `Un nombre debe tener entre 1 y ${postAuthRegisterBodyNameMax} caracteres.` as const,
    },
    invalidUsername: {
        en: {
            title: "A username must:",
            rules: [
                "Include only letters, digits, '.', '-' or '_'.",
                `Be between ${postAuthRegisterBodyUsernameMin} and ${postAuthRegisterBodyUsernameMax} characters.`,
            ],
        },
        es: {
            title: "Un nombre de usuario debe:",
            rules: [
                "Incluir únicamente letras, dígitos, '.', '-' o '_'.",
                `Tener entre ${postAuthRegisterBodyUsernameMin} y ${postAuthRegisterBodyUsernameMax} caracteres.`,
            ],
        },
    },
    usernameTaken: {
        en: "Username already exists",
        es: "El nombre de usuario ya existe",
    },
    emailTaken: {
        en: "There already is an account with this email.",
        es: "Ya existe una cuenta con este email.",
    },
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class ValidationTranslator extends TranslatorService<
    typeof validationDict
> {
    public override getAllTranslations() {
        return validationDict;
    }
}
