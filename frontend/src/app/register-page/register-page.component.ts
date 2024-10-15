import { Component } from "@angular/core";
import { registerTranslations } from "./register-page.translations";

@Component({
    selector: "app-register-page",
    standalone: true,
    imports: [],
    templateUrl: "./register-page.component.html",
})
export class RegisterPageComponent {
  dict = registerTranslations.getDict();
}
