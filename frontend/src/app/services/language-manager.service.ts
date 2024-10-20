import { effect, Injectable, signal } from "@angular/core";
import { z } from "zod";

export type Language =
    (typeof LanguageManagerService.prototype.supportedLanguages)[number];

@Injectable({
    providedIn: "root",
})
export class LanguageManagerService {
    public readonly supportedLanguages = ["en", "es"] as const;

    private initializeLanguage(): Language {
        const languageSchema = z.enum(this.supportedLanguages);
        const local = languageSchema.safeParse(
            localStorage.getItem("Language")
        );

        if (local.success) {
            return local.data;
        }

        const browserDefault = languageSchema.safeParse(
            navigator.language.split("-")[0]
        );

        if (browserDefault.success) {
            return browserDefault.data;
        }

        return "en";
    }

    public readonly currentLanguage = signal<Language>(
        this.initializeLanguage()
    );

    constructor() {
        this.currentLanguage.set(this.initializeLanguage());

        effect(() => {
            const lang = this.currentLanguage();
            document.documentElement.lang = lang;
            localStorage.setItem("Language", lang);
        });
    }
}
