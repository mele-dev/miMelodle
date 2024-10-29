import { effect, inject, Injectable, signal } from "@angular/core";
import { z } from "zod";
import { LocalStorageService } from "./local-storage.service";
import { supportedLanguages } from "../globalConstants";

export type Language = (typeof supportedLanguages)[number];

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

        const generalBrowserLanguage = languageSchema.safeParse(
            navigator.language.split("-")[0]
        );

        if (generalBrowserLanguage.success) {
            return generalBrowserLanguage.data;
        }

        return "en";
    }

    public readonly currentLanguage = signal<Language>(
        this.initializeLanguage()
    );

    constructor() {
        effect(() => {
            const lang = this.currentLanguage();
            document.documentElement.lang = lang;
            this.localStorage.setItem("language", lang);
        });
    }
}
