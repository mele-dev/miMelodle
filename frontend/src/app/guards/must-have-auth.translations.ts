import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../services/translator.service";

const translations = {
    lacksAuthError: {
        en: "Log in before using the app.",
        es: "Inicia sesión antes de usar la aplicación.",
    },
    unknownError: {
        en: "Unknown error while loading user info.",
        es: "Error desconocido al cargar la informacion del usuario.",
    },
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class MustHaveAuthTranslator extends TranslatorService<
    typeof translations
> {
    public override getAllTranslations() {
        return translations;
    }
}
