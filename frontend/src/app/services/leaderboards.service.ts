import { computed, inject, Injectable, signal } from "@angular/core";
import { FriendsService } from "./friends.service";
import { LocalStorageService } from "./local-storage.service";
import { MelodleGameMode } from "../globalConstants";
import {
    deleteUsersSelfSelfIdFriendsLeaderboards,
    DeleteUsersSelfSelfIdFriendsLeaderboardsParams,
    getLeaderboardsGameMode,
    GetLeaderboardsGameMode200,
    GetLeaderboardsGameMode200LeaderboardItem,
    GetLeaderboardsGameMode200LeaderboardItemAllOf,
    GetLeaderboardsGameMode200LeaderboardItemAllOfTwo,
} from "../../apiCodegen/backend";
import { SelfService } from "./self.service";
import { toast } from "ngx-sonner";
import { LeaderboardTranslator } from "../components/leaderboard/leaderboard.translations";
import { IconCacheService } from "./icon-cache.service";

@Injectable({
    providedIn: "root",
})
export class LeaderboardsService {
    private _friendsLeaderboard = signal([]);
    private _friendsService = inject(FriendsService);
    private _globalLineLeaderboard = signal<
        GetLeaderboardsGameMode200LeaderboardItem[]
    >([]);
    private _globalSongLeaderboard = signal<
        GetLeaderboardsGameMode200LeaderboardItem[]
    >([]);
    private _localStorage = inject(LocalStorageService);
    public globalLineLeaderboard = this._globalLineLeaderboard.asReadonly();
    public globalSongLeaderboard = this._globalSongLeaderboard.asReadonly();
    private _selfService = inject(SelfService);
    private _icons = inject(IconCacheService)

    dict = inject(LeaderboardTranslator).dict;

    public async reloadGlobals() {
        const lineMode = await getLeaderboardsGameMode("guessLine");
        this._globalLineLeaderboard.set(lineMode.data.leaderboard)

        const songMode = await getLeaderboardsGameMode("guessSong");
        this._globalSongLeaderboard.set(songMode.data.leaderboard);
    }

    public reloadFriendsLeaderboard() {}

    public async deleteData(mode: string) {
        const userId = (await this._selfService.waitForUserInfoSnapshot()).id;

        const result = deleteUsersSelfSelfIdFriendsLeaderboards(userId, {
            gameMode: mode,
        });
        console.log((await result).status)
        if ((await result).status === 404) {
            toast(this.dict().toastError);
        } else if ((await result).status === 200) {
            toast(this.dict().toastSuccess(mode));
        }
    }
}
