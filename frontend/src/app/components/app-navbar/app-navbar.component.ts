import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AllMelodlePaths, SafeRoutingService } from "../../services/safe-routing.service";
import { LanguagePickerComponent } from "../language-picker/language-picker.component";
import { AppNavbarTranslator } from "./app-navbar.translations";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { provideIcons } from "@ng-icons/core";
import { lucideBell } from "@ng-icons/lucide";
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
import { HlmMenuModule } from "@spartan-ng/ui-menu-helm";
import { BrnMenuModule } from "@spartan-ng/ui-menu-brain";
import {
    Language,
    LanguageManagerService,
} from "../../services/language-manager.service";
import { supportedLanguages } from "../../globalConstants";
import { UnreachableCaseError } from "ts-essentials";

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
        HlmMenuModule,
        BrnMenuModule,
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
    private _localStorage = inject(LocalStorageService);
    currentLanguage = inject(LanguageManagerService).currentLanguage;
    supportedLanguages = supportedLanguages;
    selfInfo = this._self.getUserInfo();

    langLongName(lang: Language) {
        switch (lang) {
            case "en":
                return "English";
            case "es":
                return "Español";
            default:
                throw new UnreachableCaseError(lang);
        }
    }

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

    logOut() {
        this._localStorage.removeItem("userInfo");
        this.safeRouter.navigate("/auth");
    }
}
