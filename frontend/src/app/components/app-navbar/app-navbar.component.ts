import { Component, computed, effect, inject, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { SafeRoutingService } from "../../services/safe-routing.service";
import { LanguagePickerComponent } from "../language-picker/language-picker.component";
import { AppNavbarTranslator } from "./app-navbar.translations";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { provideIcons } from "@ng-icons/core";
import {
    lucideBell,
    lucideLogOut,
    lucideBellPlus,
    lucideCircleSlash,
} from "@ng-icons/lucide";
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
import { SelfService } from "../../services/self.service";
import { IconCacheService } from "../../services/icon-cache.service";
import { LoadProfilePictureDirective } from "../../directives/load-profile-picture.directive";

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
        BlockingComponent,
        LoadProfilePictureDirective
    ],
    providers: [
        provideIcons({
            lucideBell,
            lucideLogOut,
            lucideBellPlus,
            lucideCircleSlash,
        }),
    ],
    templateUrl: "./app-navbar.component.html",
})
export class AppNavbarComponent {
    dict = inject(AppNavbarTranslator).dict;
    safeRouter = inject(SafeRoutingService);
    sanitizer = inject(DomSanitizer);
    private _self = inject(SelfService);
    private _icons = inject(IconCacheService);
    private readonly _localStorage = inject(LocalStorageService);

    icon = signal<string>("");

    constructor() {
        effect(async () => {
            const info = await this._self.waitForUserInfoSnapshot();

            this.icon.set(
                (await this._icons.getProfilePicture(
                    info.profilePictureFile
                )) ?? ""
            );
        });
    }

    logOut() {
        this._localStorage.removeItem("userInfo");
        this.safeRouter.navigate("/auth");
    }
}
