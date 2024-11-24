import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

export const artistFinderDict = {
    errorToast: {
        en: "Artist already on home page.",
        es: "Ese artista ya está en tu pantalla de inicio.",
    },
    successToast: {
        en: "Added successfully!",
        es: "Agregado con éxito!",
    },
    title: {
        en: "Search an artist",
        es: "Buscar un artista",
    },
    subtitle: {
        en: "by their name",
        es: "por su nombre",
    },
    followers: {
        en: "followers",
        es: "seguidores",
    },
    indications: {
        en: "To search press 'enter'",
        es: "Para buscar precione 'enter'"
    },
    followerCount: {
        en: (count: number) =>
            `${new Intl.NumberFormat("en-US", { notation: "compact" }).format(count)} followers`,
        es: (count: number) =>
            `${new Intl.NumberFormat("es-EN", { notation: "compact" }).format(count)} seguidores`,
    },
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class ArtistFinderTranslator extends TranslatorService<
    typeof artistFinderDict
> {
    public override getAllTranslations() {
        return artistFinderDict;
    }
}
