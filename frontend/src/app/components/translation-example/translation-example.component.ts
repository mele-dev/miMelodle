import { Component } from "@angular/core";
import { translationExampleTranslator } from "./translation-example.translator";
import { setCurrentLanguage } from "../../../utils/language";

@Component({
    selector: "app-translation-example",
    standalone: true,
    imports: [],
    templateUrl: "./translation-example.component.html",
})
export class TranslationExampleComponent {
    translations = translationExampleTranslator;
    setCurrentLanguage = setCurrentLanguage;
}
