import { computed, inject } from "@angular/core";
import { Language, LanguageManagerService } from "./language-manager.service";

export type Translation = Readonly<{ [K in Language]: unknown }>;
export type Translations = Readonly<Record<string, Translation>>;

export abstract class TranslatorService<
    TTranslations extends Translations,
> {
    private languageService = inject(LanguageManagerService);
    public abstract getAllTranslations(): TTranslations;

    public dict = computed(() => {
        return Object.fromEntries(
            Object.entries(this.getAllTranslations()).map(([key, value]) => [
                key,
                value[this.languageService.currentLanguage()],
            ])
        ) as {
            [K in keyof TTranslations]: TTranslations[K][Language];
        };
    });

    public updateGlobalLanguage(language: Language) {
        this.languageService.currentLanguage.set(language);
        localStorage.setItem("Language", language);
    }
}
