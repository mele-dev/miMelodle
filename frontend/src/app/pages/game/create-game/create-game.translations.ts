import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../../services/translator.service";

const translations = {
    letsGuess: {
        en: "Let's guess a ",
        es: "¡Adivinemos una ",
    },
    line: {
        en: "line!",
        es: "línea!",
    },
    song: {
        en: "song!",
        es: "canción!",
    },
    fromArtists: {
        en: "From these artists",
        es: "De estos artistas",
    },
    fromTracks: {
        en: "From these tracks",
        es: "De estas canciones",
    },
    play: {
    en: "Play",
    es: "Jugar",
  }
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class CreateGameTranslations extends TranslatorService<
    typeof translations
> {
    public override getAllTranslations() {
        return translations;
    }
}
