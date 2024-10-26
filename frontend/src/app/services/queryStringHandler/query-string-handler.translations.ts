import { Injectable } from "@angular/core";
import { Translation, Translations, TranslatorService } from "../translator.service";
import { QueryStringErrorEnum } from "./query-string-handler.service";

export const validationDict = {
  "spotify_taken": {
    "en": "There already is an account associated to that spotify account.",
    "es": "Ya existe una cuenta asociada a esa cuenta de spotify.",
  },
  "invalid_credentials": {
    "en": "Invalid credentials",
    "es": "Credenciales inválidas",
  }
} as const satisfies Translations & Record<QueryStringErrorEnum, Translation>;

@Injectable({
    providedIn: "root",
})
export class QueryStringHandlerTranslator extends TranslatorService<
    typeof validationDict
> {
    public override getAllTranslations() {
        return validationDict;
    }
}
