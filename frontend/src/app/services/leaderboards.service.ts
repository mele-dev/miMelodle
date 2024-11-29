import { inject, Injectable } from "@angular/core";
import {
    deleteUsersSelfSelfIdFriendsLeaderboards,
    getLeaderboardsGameMode,
    getUsersSelfSelfIdFriendsLeaderboards,
} from "../../apiCodegen/backend";
import { toast } from "ngx-sonner";
import { SelfService } from "./self.service";
import { LeaderboardTranslator } from "../components/leaderboard/leaderboard.translations";

type GameMode = "guessLine" | "guessSong";

export type LeaderboardFilter = {
    page: number;
    pageSize: number;
    gameMode: GameMode;
};

@Injectable({
    providedIn: "root",
})
export class LeaderboardsService {
    private _self = inject(SelfService);
    public dict = inject(LeaderboardTranslator).dict;

    public async getLeaderboard(opts: LeaderboardFilter) {
        return (await getLeaderboardsGameMode(opts.gameMode, opts));
    }

    public async getFriendsLeaderboard(opts: LeaderboardFilter) {
        const info = await this._self.waitForUserInfoSnapshot();
        return await getUsersSelfSelfIdFriendsLeaderboards(info.id, opts);
    }

    public async deleteData(mode: string) {
        const userId = (await this._self.waitForUserInfoSnapshot()).id;

        try {
            deleteUsersSelfSelfIdFriendsLeaderboards(userId, {
                gameMode: mode,
            });
            toast(this.dict().toastSuccess(mode));
        } catch {
            toast(this.dict().toastError);
        }
    }
}
