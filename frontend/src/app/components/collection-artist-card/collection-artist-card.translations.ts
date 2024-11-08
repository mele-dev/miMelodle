import { Injectable } from "@angular/core";
import { Translations, TranslatorService } from "../../services/translator.service";

export const collectionArtistCardDict = {
    followers: {
        en: "followers",
        es: "seguidores",
    },
    deleteDialog: {
        en: "Are you sure you want to delete?",
        es: "¿Estás seguro de que quieres eliminar?"
    },
    si: {
        en: "Yes",
        es: "Si"
    },
    goBack: {
        en: "Go back",
        es: "Volver"
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