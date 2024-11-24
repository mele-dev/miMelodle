import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../translator.service";

const translations = {
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
    creatingGame: {
        en: "Creating game, hold on tight!",
        es: "¡Creando partida, prepárate!",
    },
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class GuessLineServiceTranslations extends TranslatorService<
    typeof translations
> {
    public override getAllTranslations() {
        return translations;
    }
}
