import { Injectable } from "@angular/core";
import {
    Translation,
    Translations,
    TranslatorService,
} from "../../services/translator.service";
import { Language } from "../../services/language-manager.service";

@Injectable({
    providedIn: "root",
})
export class LanguagePickerTranslator extends TranslatorService<typeof loginDict> {
    public override getAllTranslations() {
        return loginDict;
    }
}
