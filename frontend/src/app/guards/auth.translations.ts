import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../services/translator.service";

const translations = {
    alreadyLoggedIn: {
    en: "You are already logged in!",
    es: "Ya habías iniciado sesión!",
  }
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class AuthGuardTranslator extends TranslatorService<
    typeof translations
> {
    public override getAllTranslations() {
        return translations;
    }
}
