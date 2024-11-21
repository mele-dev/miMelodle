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
    by: {
        en: (artists: { name: string }[]) =>
            `By ${artists.map((a) => a.name).join(", ")}`,
        es: (artists: { name: string }[]) =>
            `Por ${artists.map((a) => a.name).join(", ")}`,
    },
    from: {
        en: (album: string) => `From ${album}`,
        es: (album: string) => `De ${album}`,
    },
    snippet: {
        en: "Snippet",
        es: "Fragmento",
    },
    wonTitle: {
        en: "That's it! You won!",
        es: "¡Eso es! ¡Ganaste!",
    },
    lostTitle: {
        en: "No more attempts.",
        es: "Agotaste tus intentos.",
    },
    seeFriends: {
        en: "See my friends",
        es: "Ver a mis amigos",
    },
    playAgain: {
        en: "Play again",
        es: "Jugar de nuevo",
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
