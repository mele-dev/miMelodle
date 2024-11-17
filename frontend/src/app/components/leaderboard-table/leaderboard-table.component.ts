import { Component, ElementRef, inject, input, ViewChild } from "@angular/core";
import { GetLeaderboardsGameMode200LeaderboardItem } from "../../../apiCodegen/backend";
import { LeaderboardTranslator } from "../leaderboard/leaderboard.translations";
import { LeaderboardsService } from "../../services/leaderboards.service";
import { HlmTableComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-table.component";
import { HlmTdComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-td.component";
import { CommonModule } from "@angular/common";
import { LocalStorageService } from "../../services/local-storage.service";

@Component({
    selector: "app-leaderboard-table",
    standalone: true,
    imports: [HlmTableComponent, HlmTdComponent, CommonModule],
    templateUrl: "./leaderboard-table.component.html",
})
export class LeaderboardTableComponent {
    public leaderboard = input<GetLeaderboardsGameMode200LeaderboardItem[]>();

    dict = inject(LeaderboardTranslator).dict;
    @ViewChild("dialog") dialog!: ElementRef<HTMLDialogElement>;

    public leaderboardService = inject(LeaderboardsService);
    public localService = inject(LocalStorageService);
}
