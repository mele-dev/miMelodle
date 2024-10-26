import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

export const registerDict = {
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
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class AppNavbarTranslator extends TranslatorService<
    typeof registerDict
> {
    public override getAllTranslations() {
        return registerDict;
    }
}
