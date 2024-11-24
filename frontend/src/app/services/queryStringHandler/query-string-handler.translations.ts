import { Injectable } from "@angular/core";
import {
    Translation,
    Translations,
    TranslatorService,
} from "../translator.service";
import { QueryStringErrorEnum } from "./query-string-handler.service";

export const validationDict = {
    spotify_taken: {
        en: "There already is an account associated to that spotify account.",
        es: "Ya existe una cuenta asociada a esa cuenta de spotify.",
    },
    invalid_credentials: {
        en: "Invalid credentials.",
        es: "Credenciales inválidas.",
    },
    no_user_spotify: {
        en: "Your spotify account does not have an email associated.",
        es: "Tu cuenta de spotify no tiene un email asociado.",
    },
    backendUnknownError: {
        en: "Unknown error from backend: ",
        es: "Error desconocido del backend: ",
    },
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
