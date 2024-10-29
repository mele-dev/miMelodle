import { Injectable } from "@angular/core";
import {
    Translations,
    TranslatorService,
} from "../../services/translator.service";

export const friendShipsDict = {
    friendRequests: {
        en: "Friend Requests",
        es: "Solicitudes de amistad",
    },
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class FriendshipsTranslator extends TranslatorService<
    typeof friendShipsDict
> {
    public override getAllTranslations() {
        return friendShipsDict;
    }
}
