import { Inject, Injectable, InjectionToken } from "@angular/core";

export type Language = "en" | "es";

let currentLanguage: Language = "es";

export function getCurrentLanguage(): Language {
    // TODO
    return currentLanguage;
}

export function setCurrentLanguage(lang: Language) {
    currentLanguage = lang;
}

export type Translation = Readonly<{ [K in Language]: unknown }>;

export type Translations = Readonly<Record<string, Translation>>;

export const TranslationsInjectionToken = new InjectionToken("Translations");

@Injectable({
    providedIn: "root",
})
export class Translator<TTranslations extends Translations> {
    private translations: Translations;

    /**
     * Create a new Translation with the given translations.
     */
    constructor(
        @Inject(TranslationsInjectionToken) translations: TTranslations
    ) {
        this.translations = translations;
    }

    /**
     * name
     */
    public getTranslation<TKey extends keyof TTranslations & string>(
        key: TKey
    ): TTranslations[TKey][Language] {
        return this.translations[key][getCurrentLanguage()];
    }
}
