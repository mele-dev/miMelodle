import { Component, inject, input } from "@angular/core";
import { GetLeaderboardsGameMode200LeaderboardItem } from "../../../apiCodegen/backend";
import { CommonModule } from "@angular/common";
import { HlmTableModule } from "@spartan-ng/ui-table-helm";
import { SelfService } from "../../services/self.service";
import { LoadProfilePictureDirective } from "../../directives/load-profile-picture.directive";
import { LeaderboardTableTranslator } from "./leaderboard-table.translations";

export type Leaderboard = GetLeaderboardsGameMode200LeaderboardItem[];

@Component({
    selector: "app-leaderboard-table",
    standalone: true,
    imports: [HlmTableModule, CommonModule, LoadProfilePictureDirective],
    templateUrl: "./leaderboard-table.component.html",
})
export class LeaderboardTableComponent {
    public leaderboard = input<Leaderboard>();
    public dict = inject(LeaderboardTableTranslator).dict;
    private _self = inject(SelfService);
    public selfInfo = this._self.getUserInfo();
}
