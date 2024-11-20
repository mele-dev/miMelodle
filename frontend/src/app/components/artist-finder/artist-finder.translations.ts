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
    placeholder: {
        en: "Name of an artist",
        es: "Nombre de un artista"
    },
    indications: {
        en: "To search press 'enter'",
        es: "Para buscar precione 'enter'"
    }
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
