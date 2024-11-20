import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../services/translator.service";

const homePageTranslations = {
    empty: {
        en: "Start adding your favorite artists!",
        es: "¡Comienza a agregar tus artistas favoritos!",
    },
    welcome: {
        en: (username: string) => `Welcome back ${username}!` as const,
        es: (username:  string) => `Bienvenido de vuelta ${username}!` as const
    }
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class HomePageTranslator extends TranslatorService<
    typeof homePageTranslations
> {
    public override getAllTranslations() {
        return homePageTranslations;
    }
}
