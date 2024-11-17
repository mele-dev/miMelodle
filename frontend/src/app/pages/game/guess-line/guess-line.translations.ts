import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../../services/translator.service";

const translations = {
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
export class GuessLineTranslator extends TranslatorService<
    typeof translations
> {
    public override getAllTranslations() {
        return translations;
    }
}
