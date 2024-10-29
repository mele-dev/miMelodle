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
