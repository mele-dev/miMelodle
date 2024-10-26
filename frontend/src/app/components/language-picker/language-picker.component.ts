import { Component, inject } from "@angular/core";
import { GlobeAmericasComponent } from "../../icons/globe-americas/globe-americas.component";
import {
    Language,
    LanguageManagerService,
} from "../../services/language-manager.service";
import { FormsModule } from "@angular/forms";
import { BrnSelectImports } from "@spartan-ng/ui-select-brain";
import { HlmSelectImports } from "@spartan-ng/ui-select-helm";
import { assertUnreachable } from "../../utils/utils";

@Component({
    selector: "app-language-picker",
    standalone: true,
    imports: [
        GlobeAmericasComponent,
        FormsModule,
        BrnSelectImports,
        HlmSelectImports,
    ],
    templateUrl: "./language-picker.component.html",
})
export class LanguagePickerComponent {
    readonly languageService = inject(LanguageManagerService);

    languageCodeToLanguageName<TLang extends Language>(code: TLang) {
        switch (code) {
            case "en":
                return "english";
            case "es":
                return "español";
            default:
                return assertUnreachable(code);
        }
    }
}
