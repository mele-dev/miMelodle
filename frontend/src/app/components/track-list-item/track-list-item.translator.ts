import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

export const trackListItemTranslations = {
    followerCount: {
        en: (count: number) =>
            `${new Intl.NumberFormat("en-US", { notation: "compact" }).format(count)} followers`,
        es: (count: number) =>
            `${new Intl.NumberFormat("es-EN", { notation: "compact" }).format(count)} seguidores`,
    },
    by: {
        en: (artists: { name: string }[]) =>
            `By ${artists.map((a) => a.name).join(", ")}`,
        es: (artists: { name: string }[]) =>
            `Por ${artists.map((a) => a.name).join(", ")}`,
    },
} satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class TrackListItemTranslator extends TranslatorService<
    typeof trackListItemTranslations
> {
    public override getAllTranslations() {
        return trackListItemTranslations;
    }
}
