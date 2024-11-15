import { Injectable } from "@angular/core";
import { Translations, TranslatorService } from "../../services/translator.service";

export const collectionArtistCardDict = {
    followers: {
        en: "followers",
        es: "seguidores",
    },
    deleteDialog: {
        en: (valueName: string) => `Are you sure you want to delete ${valueName}?` as const,
        es: (valueName: string) => `¿Estás seguro que quieres eliminar a ${valueName}?` as const,
    },
    yes: {
        en: "Yes",
        es: "Si"
    },
    goBack: {
        en: "Go back",
        es: "Volver"
    },
    backendError: {
        en: "Something went wrong",
        es: "Algo salió mal"
    }
} as const satisfies Translations;

@Injectable({
  providedIn: "root"
})
export class CollectionArtistCardTranslator extends TranslatorService<typeof collectionArtistCardDict> {
    public override getAllTranslations() {
        return collectionArtistCardDict;
    }
}