import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../../services/translator.service";
import { SimplifiedArtistObject } from "../../../../apiCodegen/spotify";

const translations = {
    stringifyArtists: {
        en: (artists: SimplifiedArtistObject[]) =>
            artists.map((a) => a.name).join(", "),
        es: (artists: SimplifiedArtistObject[]) =>
            artists.map((a) => a.name).join(", "),
    },
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class GuessSongTranslator extends TranslatorService<
    typeof translations
> {
    public override getAllTranslations() {
        return translations;
    }
}
