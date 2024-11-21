import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

export const userConfigDict = {
    deleteAccount: {
        en: "Delete Account",
        es: "Borrar cuenta",
    },
    deleteRanking: {
        en: "Delete Ranking Data",
        es: "Borrar datos de clasificación",
    },
    questionAccount: {
        en: "Are you sure you want to delete your account? You cannot undo this action.",
        es: "¿Estás seguro que deseas eliminar tu cuenta? No puedes deshacer esta acción.",
    },
    questionRanking: {
        en: "By writting a game mode, the ranking data for that game mode will be cleared. Are you sure you want to continue?",
        es: "Al escribir un modo de juego, los datos de clasificación del mismo se borrarán para el mismo. ¿Estás seguro de continuar?",
    },
    userConfig: {
        en: "User config",
        es: "Configuración",
    },
    password: {
        en: "Password",
        es: "Contraseña",
    },
    dangerZone: {
        en: "Danger Zone",
        es: "Zona peligrosa",
    },
    userIcon: {
        en: "User icon",
        es: "Icono de Usuario",
    },
    name: {
        en: "Name",
        es: "Nombre",
    },
    username: {
        en: "Username",
        es: "Nombre de usuario",
    },
    email: {
        en: "Email",
        es: "Correo electrónico",
    },
    save: {
        en: "Save Changes",
        es: "Guardar cambios",
    },
    enterPassword: {
        en: "Enter your password to confirm your changes.",
        es: "Ingresa tu contraseña para confirmar los cambios.",
    },
    passwordSection: {
        en: "Change your password here. After saving, you'll be logged out.",
        es: "Cambia tu contraseña aquí. Luego de guardar, su sesión será cerrada.",
    },
    old: {
        en: "Old password",
        es: "Constraseña antigüa",
    },
    new: {
        en: "New password",
        es: "Nueva constraseña",
    },
    loading: {
        en: "Loading...",
        es: "Cargando...",
    },
    edit: {
        en: "Edit profile",
        es: "Editar perfil",
    },
    gameMode: {
        en: "Game mode",
        es: "Modo de juego",
    },
    delete: {
        en: "Delete",
        es: "Borrar",
    },
    rankingExplanation: {
        en: "Clear all your ranking data for a specific game mode.",
        es: "Borra todos tus datos de clasificación de un modo de juego determinado.",
    },
    accountExplanation:
    {
        en:"To continue, enter your password",
        es: "Para continuar ingrese su contraseña"
    }
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class UserConfigTranslator extends TranslatorService<
    typeof userConfigDict
> {
    public override getAllTranslations() {
        return userConfigDict;
    }
}
