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
    getUsersSelfSelfIdFriendsLeaderboards,
} from "../../apiCodegen/backend";
import { SelfService } from "./self.service";
import { toast } from "ngx-sonner";
import { LeaderboardTranslator } from "../components/leaderboard/leaderboard.translations";
import { IconCacheService } from "./icon-cache.service";
import { getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemNameMax } from "../../apiCodegen/backend-zod";

@Injectable({
    providedIn: "root",
})
export class LeaderboardsService {
    private _friendsLeaderboard = signal<
        GetLeaderboardsGameMode200LeaderboardItem[]
    >([]);

    private _globalLeaderboard = signal<
        GetLeaderboardsGameMode200LeaderboardItem[]
    >([]);

    public friendsSongLeaderboard = computed(() => {
        return this._friendsLeaderboard().filter(
            (user) => user.mode === "guessSong"
        );
    });

    public friendsLineLeaderboard = computed(() => {
        return this._friendsLeaderboard().filter(
            (user) => user.mode === "guessLine"
        );
    });

    public globalLineLeaderboard = computed(() => {
        return this._globalLeaderboard().filter(
            (user) => user.mode === "guessLine"
        );
    });

    public globalSongLeaderboard = computed(() => {
        return this._globalLeaderboard().filter(
            (user) => user.mode === "guessSong"
        );
    });

    private _selfService = inject(SelfService);
    private _icons = inject(IconCacheService);

    dict = inject(LeaderboardTranslator).dict;

    public async reloadGlobals() {
        const lineMode = await getLeaderboardsGameMode("guessLine");
        const songMode = await getLeaderboardsGameMode("guessSong");
        this._globalLeaderboard.update((currentValue) => [
            ...currentValue,
            ...lineMode.data.leaderboard,
            ...songMode.data.leaderboard,
        ]);
        console.log(await this._globalLeaderboard());
    }

    public async reloadFriends() {
        const userId = (await this._selfService.waitForUserInfoSnapshot()).id;
        const lineMode = await getUsersSelfSelfIdFriendsLeaderboards(userId, {
            gameMode: "guessLine",
        });

        const songMode = await getUsersSelfSelfIdFriendsLeaderboards(userId, {
            gameMode: "guessSong",
        });
        this._friendsLeaderboard.update((currentValue) => [
            ...currentValue,
            ...lineMode.data.leaderboard,
            ...songMode.data.leaderboard,
        ]);
    }

    public async deleteData(mode: string) {
        const userId = (await this._selfService.waitForUserInfoSnapshot()).id;

        const result = deleteUsersSelfSelfIdFriendsLeaderboards(userId, {
            gameMode: mode,
        });
        console.log((await result).status);
        if ((await result).status === 404) {
            toast(this.dict().toastError);
        } else if ((await result).status === 200) {
            toast(this.dict().toastSuccess(mode));
        }
    }
}
