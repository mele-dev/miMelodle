import { effect, inject, Injectable, signal } from "@angular/core";
import { z } from "zod";
import { LocalStorageService } from "./local-storage.service";

export type Language =
    (typeof LanguageManagerService.prototype.supportedLanguages)[number];

export const supportedLanguages = ["en", "es"] as const;

@Injectable({
    providedIn: "root",
})
export class LanguageManagerService {
    public readonly supportedLanguages = supportedLanguages;
    private readonly localStorage = inject(LocalStorageService);

    private initializeLanguage(): Language {
        const languageSchema = z.enum(this.supportedLanguages);
        const local = this.localStorage.getItem("language");

        if (local !== null) {
            return local;
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
            this.localStorage.setItem("language", lang);
        });
    }
}
