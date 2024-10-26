import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../services/translator.service";

const translations = {
    authError: {
        en: "Error while loading credentials.",
        es: "Error cargando credenciales.",
    },
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class AuthCallbackGuardTranslator extends TranslatorService<
    typeof translations
> {
    public override getAllTranslations() {
        return translations;
    }
}
