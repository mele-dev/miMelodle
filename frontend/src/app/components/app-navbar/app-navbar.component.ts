import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import {
    AllPopdlePaths,
    SafeRoutingService,
} from "../../services/safe-routing.service";
import { LanguagePickerComponent } from "../language-picker/language-picker.component";
import { AppNavbarTranslator } from "./app-navbar.translations";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { provideIcons } from "@ng-icons/core";
import {
    lucideLogOut,
    lucideBellPlus,
    lucideCircleSlash,
} from "@ng-icons/lucide";
import { lucideBell, lucideSearch } from "@ng-icons/lucide";
import { LocalStorageService } from "../../services/local-storage.service";
import { BrnPopoverModule } from "@spartan-ng/ui-popover-brain";
import { HlmPopoverModule } from "@spartan-ng/ui-popover-helm";
import { DomSanitizer } from "@angular/platform-browser";
import {
    HlmButtonDirective,
    HlmButtonModule,
} from "@spartan-ng/ui-button-helm";
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
import { HlmDialogComponent } from "../../../../libs/ui/ui-dialog-helm/src/lib/hlm-dialog.component";
import { HlmDialogContentComponent } from "../../../../libs/ui/ui-dialog-helm/src/lib/hlm-dialog-content.component";
import { UserFinderComponent } from "../user-finder/user-finder.component";
import {
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
} from "@spartan-ng/ui-dialog-helm";
import { HlmLabelDirective } from "@spartan-ng/ui-label-helm";
import { HlmInputDirective } from "@spartan-ng/ui-input-helm";
import { BrnDialogContentDirective, BrnDialogTriggerDirective } from "@spartan-ng/ui-dialog-brain";

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
        HlmTabsModule,
        CommonModule,
        HlmMenuModule,
        BrnMenuModule,
        HlmDialogComponent,
        HlmDialogContentComponent,
        UserFinderComponent,
        HlmButtonDirective,
        BrnDialogContentDirective,
        HlmDialogComponent,
        HlmDialogContentComponent,
    ],
    providers: [
        provideIcons({
            lucideBell,
            lucideSearch,
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
        }
    }

    currentSection() {
        const url = this.safeRouter.url;
        return {
            game: url.startsWith("/app/game" satisfies AllPopdlePaths),
            home: url.startsWith("/app/home" satisfies AllPopdlePaths),
            leaderboards: url.startsWith(
                "/app/leaderboards" satisfies AllPopdlePaths
            ),
            profile: url.startsWith("/app/profile" satisfies AllPopdlePaths),
        } as const;
    }

    ngOnInit() {
        this.safeRouter.router.url;
    }

    logOut() {
        this._localStorage.removeItem("userInfo");
        this._localStorage.removeItem("trackCache");
        this.safeRouter.navigate("/auth");
    }
}
