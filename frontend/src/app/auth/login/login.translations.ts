import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

export const loginDict = {
    welcomeTo: {
        en: "Welcome back to",
        es: "¡Bienvenido de nuevo a",
    },
    afterBouncyMelodle: {
        en: "!",
        es: "!",
    },
    emailOrUsername: {
        en: "Email or username (TODO: username)",
        es: "Email o nombre de usuario (TODO: username)",
    },
    password: {
        en: "Password",
        es: "Contraseña",
    },
    orLoginVia: {
        en: "Or login via",
        es: "O inicia sesión vía",
    },
    registerLink: {
        en: "Don't have an account? Create one here.",
        es: "¿No tienes una cuenta? Créala aquí.",
    },
    login: {
        en: "Log in",
        es: "Iniciar sesión",
    },
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class LoginTranslator extends TranslatorService<typeof loginDict> {
    public override getAllTranslations() {
        return loginDict;
    }
}
