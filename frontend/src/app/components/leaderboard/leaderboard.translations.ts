import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

const leaderboardTranslations = {
    title: {
        en: "Global leaderboard",
        es: "Tabla de clasifiación"
    },
    deleteDialog: {
        en: "By choosing a game mode, the ranking data for that game mode will be cleared. Are you sure you want to continue?",
        es: "Al elegir un modo de juego, los datos de clasificación del mismo se borrarán. ¿Estás seguro de continuar?",
    },
    toastSuccess: {
        en: (gameMode: string) => `Your ranking data has been deleted from the game mode ${gameMode}.` as const,
        es: (gameMode : string) => `Se han eliminado tus datos de clasificación del modo de juego ${gameMode}.` as const,
    },
    toastError: {
        en:'Your data has already been deleted.',
        es: 'Tus datos ya han sido eliminados.',
    
    },
    guessSong: {
        en: 'Guess song',
        es: 'Adivina la canción'
    },
    guessLine: {
        en: 'Guess line',
        es: 'Adivina la linea'
    },
    deleteDataButton: {
        en: 'Delete my ranking data',
        es: 'Borrar mis datos de clasificación'
    }
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class LeaderboardTranslator extends TranslatorService<
    typeof leaderboardTranslations
> {
    public override getAllTranslations() {
        return leaderboardTranslations;
    }
}
