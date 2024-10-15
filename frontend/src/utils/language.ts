import { Inject, Injectable, InjectionToken } from "@angular/core";

export type Language = "en" | "es";

let currentLanguage: Language = (["en", "es"] as const)[
    Math.floor(Math.random() * 2)
];

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
    public get<TKey extends keyof TTranslations & string>(
        key: TKey
    ): TTranslations[TKey][Language] {
        return this.translations[key][getCurrentLanguage()];
    }

    public getDict(): {
        [K in keyof TTranslations]: TTranslations[K][Language];
    } {
        return Object.fromEntries(
            Object.entries(this.translations).map(([key, value]) => [
                key,
                value[getCurrentLanguage()],
            ])
            // As any out of lazyness. Fix it if you want, i'm pretty sure its ok
            // as-is - cr
        ) as any;
    }
}
