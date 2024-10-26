import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SafeRoutingService } from "../../services/safe-routing.service";
import { LanguagePickerComponent } from "../language-picker/language-picker.component";
import { AppNavbarTranslator } from "./app-navbar.translations";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { provideIcons } from "@ng-icons/core";
import { lucideBell } from "@ng-icons/lucide";

@Component({
    selector: "app-app-navbar",
    standalone: true,
    imports: [RouterLink, LanguagePickerComponent, HlmIconModule],
    providers: [provideIcons({ lucideBell })],
    templateUrl: "./app-navbar.component.html",
})
export class AppNavbarComponent {
    dict = inject(AppNavbarTranslator).dict;
    safeRouter = inject(SafeRoutingService);
}
