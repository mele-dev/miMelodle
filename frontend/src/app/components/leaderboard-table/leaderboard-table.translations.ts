import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

const leaderboardTableTranslations = {
    rank: {
        en: "Rank",
        es: "Ranking",
    },
    user: {
        en: "User",
        es: "Usuario",
    },
    score: {
        en: "Score",
        es: "Puntuación",
    }
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class LeaderboardTableTranslator extends TranslatorService<
    typeof leaderboardTableTranslations
> {
    public override getAllTranslations() {
        return leaderboardTableTranslations;
    }
}
