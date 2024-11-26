import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

const translations = {
    searchUsersError: {
        en: "Error while searching for users.",
        es: "Error al buscar usuarios.",
    },
    title: {
        en: ["Search users", "by username."],
        es: ["Buscar usuarios", "por nombre de usuario."],
    },
    usernamePlaceholder: {
        en: "The.username-from_someone.else",
        es: "El.nombre-de-usuario_de_otra.persona",
    },
    addFriend: {
        en: "Add friend",
        es: "Agregar amigo",
    },
    block: {
        en: "Block",
        es: "Bloquear",
    },
    removeFriend: {
        en: "Remove friend",
        es: "Eliminar amigo",
    },
    actions: {
        en: "Actions",
        es: "Acciones",
    },
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class UserFinderTranslator extends TranslatorService<
    typeof translations
> {
    public override getAllTranslations() {
        return translations;
    }
}
