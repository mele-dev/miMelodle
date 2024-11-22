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
    decline: {
        en: "Decline",
        es: "Rechazar",
    },
    accept: {
        en: "Accept",
        es: "ACeptar"
    },
    empty: {
        en: "You don't have any friend requests.",
        es: "No tienes ninguna solicitud de amistad."
    }
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
