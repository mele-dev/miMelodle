import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

export const navbarDict = {
    play: {
        en: "Play",
        es: "Jugar",
    },
    leaderboards: {
        en: "Leaderboards",
        es: "Clasificaciones",
    },
    home: {
        en: "Home",
        es: "Inicio",
    },
    profile: {
        en: "Profile",
        es: "Perfil",
    },
    friendRequests: {
        en: "Friend Requests",
        es: "Solicitudes de amistad",
    },
    blocked: {
        en: "Blocked",
        es: "Bloqueados",
    },
    myProfile: {
        en:"My profile",
        es: "Mi perfil"
    },
    language: {
        en: "Language",
        es: "Lenguaje"
    },
    logOut:{
        en: "Log out",
        es: "Cerrar sesión"
    }
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class AppNavbarTranslator extends TranslatorService<typeof navbarDict> {
    public override getAllTranslations() {
        return navbarDict;
    }
}
