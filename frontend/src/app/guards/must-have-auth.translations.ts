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
