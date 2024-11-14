import { Component, inject } from "@angular/core";
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
import { BrnPopoverModule } from "@spartan-ng/ui-popover-brain";
import { HlmPopoverModule } from "@spartan-ng/ui-popover-helm";
import { DomSanitizer } from "@angular/platform-browser";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { FriendshipsComponent } from "../friendships/friendships.component";
import { BlockingComponent } from "../blocking/blocking.component";
import { SelfService } from "../../services/self.service";
import { LoadProfilePictureDirective } from "../../directives/load-profile-picture.directive";
import { CommonModule, JsonPipe } from "@angular/common";
import { HlmTabsModule } from "@spartan-ng/ui-tabs-helm";
import { AllMelodlePaths } from "../../app.routes";

@Component({
    selector: "app-app-navbar",
    standalone: true,
    imports: [
        RouterLink,
        LanguagePickerComponent,
        HlmIconModule,
        HlmPopoverModule,
        BrnPopoverModule,
        HlmButtonModule,
        FriendshipsComponent,
        BlockingComponent,
        LoadProfilePictureDirective,
        JsonPipe,
        HlmTabsModule,
        CommonModule,
    ],
    providers: [
        provideIcons({
            lucideBell,
        }),
    ],
    templateUrl: "./app-navbar.component.html",
})
export class AppNavbarComponent {
    dict = inject(AppNavbarTranslator).dict;
    safeRouter = inject(SafeRoutingService);
    sanitizer = inject(DomSanitizer);
    private _self = inject(SelfService);

    selfInfo = this._self.getUserInfo();

    currentSection() {
        const url = this.safeRouter.url;
        return {
            game: url.startsWith("/app/game" satisfies AllMelodlePaths),
            home: url.startsWith("/app/home" satisfies AllMelodlePaths),
            leaderboards: url.startsWith(
                "/app/leaderboards" satisfies AllMelodlePaths
            ),
            profile: url.startsWith("/app/profile" satisfies AllMelodlePaths),
        } as const;
    }

    ngOnInit() {
        this.safeRouter.router.url;
    }

    //logOut() {
    //    this._localStorage.removeItem("userInfo");
    //    this.safeRouter.navigate("/auth");
    //}
}
