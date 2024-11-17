import { computed, inject, Injectable, signal } from "@angular/core";
import { FriendsService } from "./friends.service";
import { LocalStorageService } from "./local-storage.service";
import { getLeaderboards, GetLeaderboards200, GetLeaderboardsParams } from "../../apiCodegen/backend";

@Injectable({
    providedIn: "root",
})
export class LeaderboardsService {
    private _friendsLeaderboard = signal([]);
    private _friendsService = inject(FriendsService);
    private _globalLeaderboard = signal<GetLeaderboards200[]>([]);
    private _localStorage = inject(LocalStorageService)
    public globalLeaderboard = this._globalLeaderboard.asReadonly()

    public friendsOnLeaderboard = computed(() => {
        return this._globalLeaderboard().filter((f) =>
            this._friendsService.friends().find(f)
        );
    });

    private async getGlobal(gameMode: GetLeaderboardsParams){
        const result = await getLeaderboards(gameMode);

        this._globalLeaderboard.set(result.data as GetLeaderboards200[]);
    }

    public getFriendsLeaderboard(){

    }
}
