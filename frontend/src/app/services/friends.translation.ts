import { Injectable } from "@angular/core";
import { Translations, TranslatorService } from "./translator.service";

export const friendsDict = {
    sendFriendRequestError: {
        en: "Error while sending friend request.",
        es: "Error al enviar solicitud de amistad.",
    },
    sendFriendRequestSucces: {
        en: (friend: string) => `Friend request sent to ${friend}` as const,
        es: (friend: string) =>
            `Solicitud de amistad enviada a ${friend}` as const,
    },
    deleteFriendError: {
        en: "Error while deleting relationship.",
        es: "Error al eliminar relación.",
    },
    deleteFriendSuccess: {
        en: (friend: string) => `Relationship deleted with ${friend}.` as const,
        es: (friend: string) =>
            `Relación eliminada con ${friend}.` as const,
    },
    acceptFriendRequestError: {
        en: "Error while accepting friend request.",
        es: "Error al aceptar solicitud de amistad.",
    },
    acceptFriendRequestSuccess: {
        en: (friend: string) => `Accepted friend request from ${friend}.` as const,
        es: (friend: string) =>
            `Solicidud de amistad de ${friend} aceptada.` as const,
    },
} as const satisfies Translations;

@Injectable({
    providedIn: "root",
})
export class FriendsTranslator extends TranslatorService<typeof friendsDict> {
    public override getAllTranslations() {
        return friendsDict;
    }
}
