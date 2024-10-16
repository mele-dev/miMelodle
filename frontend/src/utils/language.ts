import {
    computed,
    Inject,
    Injectable,
    InjectionToken,
    signal,
} from "@angular/core";

export const supportedLanguages = ["en", "es"] as const;
export type Language = (typeof supportedLanguages)[number];
export type Translation = Readonly<{ [K in Language]: unknown }>;
export type Translations = Readonly<Record<string, Translation>>;
export const TranslationsInjectionToken = new InjectionToken("Translations");

@Injectable({
    providedIn: "root",
})
export class Translator<TTranslations extends Translations> {
    private translations: Translations;

    public static readonly currentLanguage = signal<Language>("en");

    /**
     * Create a new Translation with the given translations.
     */
    constructor(
        @Inject(TranslationsInjectionToken) translations: TTranslations
    ) {
        this.translations = translations;
    }

    public dict = computed(() => {
        return Object.fromEntries(
            Object.entries(this.translations).map(([key, value]) => [
                key,
                value[Translator.currentLanguage()],
            ])
        ) as {
            [K in keyof TTranslations]: TTranslations[K][Language];
        };
    });

    public updateGlobalLanguage(language: Language) {
        Translator.currentLanguage.set(language);
        localStorage.setItem("Language", language);
    }
}
