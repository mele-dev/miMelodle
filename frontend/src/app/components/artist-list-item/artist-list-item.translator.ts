import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";
export const artistListItemTranslations = {
    followerCount: {
        en: (count: number) =>
            `${new Intl.NumberFormat("en-US", { notation: "compact",  }).format(count)}`,
        es: (count: number) =>
            `${new Intl.NumberFormat("es-EN", { notation: "compact" }).format(count)}`,
    },
} satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class ArtistListItemTranslator extends TranslatorService<
    typeof artistListItemTranslations
> {
    public override getAllTranslations() {
        return artistListItemTranslations;
    }
}
