import { Component, inject, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SafeRoutingService } from "../../services/safe-routing.service";
import { LanguagePickerComponent } from "../language-picker/language-picker.component";
import { AppNavbarTranslator } from "./app-navbar.translations";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { provideIcons } from "@ng-icons/core";
import { lucideBell, lucideLogOut, lucideBellPlus, lucideCircleSlash } from "@ng-icons/lucide";
import { LocalStorageService } from "../../services/local-storage.service";
import {
    BrnPopoverCloseDirective,
    BrnPopoverComponent,
    BrnPopoverContentDirective,
    BrnPopoverTriggerDirective,
} from "@spartan-ng/ui-popover-brain";
import {
    HlmPopoverCloseDirective,
    HlmPopoverContentDirective,
} from "@spartan-ng/ui-popover-helm";
import { DomSanitizer } from "@angular/platform-browser";
import { BackendIcon } from "../../types/backend-icon";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { FriendshipsComponent } from "../friendships/friendships.component";
import { BlockingComponent } from "../blocking/blocking.component";

@Component({
    selector: "app-app-navbar",
    standalone: true,
    imports: [
    RouterLink,
    LanguagePickerComponent,
    HlmIconModule,
    BrnPopoverCloseDirective,
    BrnPopoverComponent,
    BrnPopoverContentDirective,
    BrnPopoverTriggerDirective,
    HlmPopoverCloseDirective,
    HlmPopoverContentDirective,
    HlmButtonModule,
    FriendshipsComponent,
    BlockingComponent
],
    providers: [provideIcons({ lucideBell, lucideLogOut, lucideBellPlus, lucideCircleSlash })],
    templateUrl: "./app-navbar.component.html",
})
export class AppNavbarComponent {
    dict = inject(AppNavbarTranslator).dict;
    safeRouter = inject(SafeRoutingService);
    chosenIcon = signal<BackendIcon | undefined>(undefined);
    sanitizer = inject(DomSanitizer);
    private readonly _localStorage = inject(LocalStorageService);

    logOut() {
        this._localStorage.removeItem("userInfo");
        this.safeRouter.navigate(["/auth"]);
    }
}
