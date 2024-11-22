import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

const tutorialsTranslations = {
    title: {
        en: "A quick tutorial of Melodle",
        es: "Un tutorial rápido de Melodle",
    },
    objetiveTitle: {
        en: "Objetive",
        es: "Objetivo",
    },
    objetiveLine: {
        en: "Guess the line from the given song in 6 attempts.",
        es: "Adivina la línea de la canción dada en 6 intentos.",
    },
    objetiveSong: {
        en: "Guess the song from the chosen artist in 6 attempts.",
        es: "Adivina la canción del artista elegido en 6 intentos.",
    },
    howToPlayTitle: {
        en: "How to play?",
        es: "¿Cómo jugar?",
    },
    howToPlayLine: {
        en: "Write a line of the song and press 'enter'.",
        es: "Escribe una línea de la canción y presiona 'enter'.",
    },
    howToPlaySong: {
        en: "Write the name of a song by the artist and press 'enter'.",
        es: "Escribe el nombre de una canción y presiona 'enter'.",
    },
    start: {
        en: "Start",
        es: "Empezar",
    },
    feedback: {
        en: "Hints",
        es: "Pistas",
    },
    feedbackDescription: {
        en: "When you enter a song, you will receive visual feedback on how many letters match the correct song.",
        es: "Cuando ingresas una canción, recibirás reatroalimentación de cuales letras están en la canción.",
    },
    feedbackDescriptionLine: {
        en: "When you enter a line, you will receive visual feedback on how many letters match the correct song.",
        es: "Cuando ingresas una línea, recibirás reatroalimentación de cuales letras están en la línea dada.",
    },
    correctAlbum: {
        en: "If you guess a song that belongs to the same album as the target song, the album cover will have a",
        es: "Si adivinas una canción que pertenece al mismo álbum que la canción objetivo, la imagen del albúm tendrá",
    },
    incorrectAlbum : {
        en: "otherwise, it will have",
        es: "de lo contrario, verás"
    },
    snippet: {
        en: "When you reach 5 attempts, we'll give you a line from the song.",
        es: "Cuando llegues al quinto intento, te daremos una línea de la canción."
    },
    lineLength: {
        en: "You will be given the number of characters in the line.",
        es: "Se te dará la cantidad de caractéres de la línea."
    }
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class TutorialsTranslator extends TranslatorService<
    typeof tutorialsTranslations
> {
    public override getAllTranslations() {
        return tutorialsTranslations;
    }
}
