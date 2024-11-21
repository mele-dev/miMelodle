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
    guessLineOf: {
        en: (length: number) => `Guess the line of ${length} characters from`,
        es: (length: number) => `Adivina la línea de ${length} caracteres de`,
    },
    notEveryAttempt: {
        en: "You didn't even need every attempt!",
        es: "¡Ni siquiera necesitaste todos los intentos!",
    },
    writeFullLength: {
        en: "You need to write the full length of the line.",
        es: "Necesitas escribir todo el largo de la línea.",
    },
    errorFetchingInformation: {
        en: "There was an error while fetching game information.",
        es: "Hubo un error al conseguir la información del juego.",
    },
    retry: {
        en: "Retry",
        es: "Reintentar",
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
