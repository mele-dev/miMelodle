import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SafeRoutingService } from "../../services/safe-routing.service";
import { LanguagePickerComponent } from "../language-picker/language-picker.component";
import { AppNavbarTranslator } from "./app-navbar.translations";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { provideIcons } from "@ng-icons/core";
import { lucideBell, lucideLogOut } from "@ng-icons/lucide";
import { LocalStorageService } from "../../services/local-storage.service";

@Component({
    selector: "app-app-navbar",
    standalone: true,
    imports: [RouterLink, LanguagePickerComponent, HlmIconModule],
    providers: [provideIcons({ lucideBell, lucideLogOut })],
    templateUrl: "./app-navbar.component.html",
})
export class AppNavbarComponent {
    dict = inject(AppNavbarTranslator).dict;
    safeRouter = inject(SafeRoutingService);
    private readonly _localStorage = inject(LocalStorageService);

    logOut() {
        this._localStorage.removeItem("userInfo");
        this.safeRouter.navigate(["/auth"]);
    }
}
