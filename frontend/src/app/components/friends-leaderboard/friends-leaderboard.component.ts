import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { LeaderboardTranslator } from "../leaderboard/leaderboard.translations";
import { LocalStorageService } from "../../services/local-storage.service";
import { DomSanitizer } from "@angular/platform-browser";
import { IconCacheService } from "../../services/icon-cache.service";
import { LeaderboardsService } from "../../services/leaderboards.service";
import {
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
} from "@spartan-ng/ui-tabs-helm";
import { RouterLink } from "@angular/router";
import { XComponent } from "../../icons/x/x.component";
import { HlmIconComponent } from "@spartan-ng/ui-icon-helm";
import {
    HlmTableComponent,
    HlmTdComponent,
    HlmThComponent,
    HlmTrowComponent,
} from "@spartan-ng/ui-table-helm";
import { TrophyComponent } from "../../icons/trophy/trophy.component";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-friends-leaderboard",
    standalone: true,
    imports: [
        HlmTableComponent,
        HlmTrowComponent,
        HlmTdComponent,
        TrophyComponent,
        HlmThComponent,
        CommonModule,
        HlmIconComponent,
        XComponent,
        RouterLink,
        HlmTabsComponent,
        HlmTabsContentDirective,
        HlmTabsListComponent,
        HlmTabsTriggerDirective,
    ],
    templateUrl: "./friends-leaderboard.component.html",
})
export class FriendsLeaderboardComponent {
    dict = inject(LeaderboardTranslator).dict;
    @ViewChild("dialog") dialog!: ElementRef<HTMLDialogElement>;
    public localService = inject(LocalStorageService);

    public leaderboardService = inject(LeaderboardsService);
    sanitizer = inject(DomSanitizer);
    public iconsService = inject(IconCacheService);

    ngOnInit() {
        this.leaderboardService.reloadFriends();
    }

    public deleteAllData(gameMode: string) {
        this.leaderboardService.deleteData(gameMode);
        this.closeDialog();
    }

    public openDialog() {
        this.dialog.nativeElement.showModal();
    }

    public closeDialog() {
        this.dialog.nativeElement.close();
    }
}
