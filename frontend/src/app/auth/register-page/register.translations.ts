import { Injectable } from "@angular/core";
import { validationDict } from "../../services/client-validation.translation";
import { Translations, TranslatorService } from "../../services/translator.service";

export const registerDict = {
    title: {
        en: "Join melodle",
        es: "Únete a melodle",
    },
    existingAccount: {
        en: "Already have an account? Log in.",
        es: "¿Ya tienes una cuenta? Inicia sesión.",
    },
    howDoYouWantOthersToSeeYou: {
        en: "How do you want others to see you?",
        es: "¿Cómo quieres que los demás te vean?",
    },
    iconDescription: {
        en: "Select your profile picture",
        es: "Selecciona tu foto de perfil",
    },
    namePlaceholder: {
        en: "Your name",
        es: "Tu nombre",
    },
    usernamePlaceholder: {
        en: "Your-username",
        es: "Tu-nombre-de-usuario",
    },
    weNeedSomeDataToIdentifyYou: {
        en: "We need some data to identify you",
        es: "Necesitamos algunos datos para identificarte",
    },
    email: {
        en: "Email",
        es: "Email",
    },
    password: {
        en: "Password",
        es: "Contraseña",
    },
    confirmPassword: {
        en: "Confirm password",
        es: "Confirmar contraseña",
    },
    createAccountButton: {
        en: "Create account",
        es: "Crear cuenta",
    },
    orRegister: {
        en: "Or register via",
        es: "O regístrate vía",
    },
    mustComplete: {
        en: (valueName: string) => `You must provide a ${valueName}.` as const,
        es: (valueName: string) => `Debes completar tu ${valueName}.` as const,
    },
    name: {
        en: "name",
        es: "nombre",
    },
    username: {
        en: "username",
        es: "nombre de usuario",
    },
    Name: {
        en: "Name",
        es: "Nombre",
    },
    Username: {
        en: "Username",
        es: "Nombre de usuario",
    },
    ...validationDict,
} as const satisfies Translations;

@Injectable({
  providedIn: "root"
})
export class RegisterTranslator extends TranslatorService<typeof registerDict> {
    public override getAllTranslations() {
        return registerDict;
    }
}
