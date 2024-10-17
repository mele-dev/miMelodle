import { Translator } from "../../../utils/language";

export const registerTranslations = new Translator({
    title: {
        en: "Join melodle",
        es: "Unirse a melodle",
    },
    existingAccount: {
        en: "Already have an account? Log in.",
        es: "¿Ya tienes una cuenta? Inicia sesión.",
    },
    howDoYouWantOthersToSeeYou: {
        en: "How do you want others to see you?",
        es: "¿Cómo quieres que te vean los demás?",
    },
    nameDescription: {
        en: "A name for others to see",
        es: "El nombre que verán los demás",
    },
    usernameDescription: {
        en: "A username for others to search",
        es: "Un identificador para buscarte",
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
        es: "Correo electrónico",
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
        es: "O regístrese via",
    },
    mustComplete: {
        en: (valueName: string) => `You must provide a ${valueName}.` as const,
        es: (valueName: string) => `Debe completar su ${valueName}.` as const,
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
} as const);
