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
    },
    creatingGame: {
        en: "Creating game, hold on tight!",
        es: "¡Creando partida, prepárate!",
    },
    gameCreated: {
        en: "Game created!",
        es: "¡Partida creada!",
    },
    errorWhileCreatingGame: {
        en: "Error while creating game",
        es: "Error al crear partida",
    },
    retry: {
        en: "Retry",
        es: "Reintentar",
    },
    TODOGamemode: {
        en: "TODO! Try a different game mode",
        es: "¡Por hacer! Prueba otro modo de juego.",
    },
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
