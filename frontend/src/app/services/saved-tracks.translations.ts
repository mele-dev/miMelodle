import { Injectable } from "@angular/core";
import { Translations, TranslatorService } from "./translator.service";
import { getSpotifySearchQueryPageSizeMax } from "../../apiCodegen/backend-zod";

export const savedTracksDict = {
    alreadyAdded: {
        en: "You have already added that track.",
        es: "Ya añadiste esa canción.",
    },
    maxTracksReached: {
        en: `Max of ${getSpotifySearchQueryPageSizeMax} tracks.`,
        es: `Máximo de ${getSpotifySearchQueryPageSizeMax} canciones.`,
    }
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class SavedTracksTranslationService extends TranslatorService<
    typeof savedTracksDict
> {
    public override getAllTranslations() {
        return savedTracksDict;
    }
}
