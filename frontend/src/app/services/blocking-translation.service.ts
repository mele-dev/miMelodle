import { Injectable } from '@angular/core';
import { Translations, TranslatorService } from './translator.service';

export const blockingDict = {
  unblockError: {
    en: "Couldn't unblock user.",
    es: 'No se pudo desbloquear al usuario.',
  },
  unblockSuccess: {
    en: (user: string) => `User ${user} unblocked successfully!.` as const,
    es : (user: string) => `Usuario ${user} desbloqueado con éxito!` as const,
  },
  blockError: {
    en: "Couldn't block user.",
    es: 'No se pudo bloquear al usuario.',
  },
  blockSuccess:{
    en: (user: string) => `User ${user} blocked successfully!.` as const,
    es : (user: string) => `Usuario ${user} bloqueado con éxito!` as const,
  },
  title: {
    en: "Users blocked",
    es: "Usuarios bloqueados"
  }
} as const satisfies Translations;

@Injectable({
  providedIn: 'root'
})
export class BlockingTranslationService extends TranslatorService<typeof blockingDict> {
  public override getAllTranslations() {
    return blockingDict;
  }
}
