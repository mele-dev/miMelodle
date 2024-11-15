import { computed, inject, Injectable, signal } from "@angular/core";
import { FriendsService } from "./friends.service";

@Injectable({
    providedIn: "root",
})
export class LeaderboardsService {
    private _friendsLeaderboard = signal([]);
    private _friendsService = inject(FriendsService);
    private _globalLeaderboard = signal([]);

    public friendsOnLeaderboard = computed(() => {
        return this._globalLeaderboard().filter((f) =>
            this._friendsService.friends().find(f)
        );
    });
}
