import {
    computed,
    inject,
    Injectable,
    signal,
} from "@angular/core";
import {
    getUsersSelfSelfIdFriends,
    GetUsersSelfSelfIdFriends200Item,
} from "../../apiCodegen/backend";
import { LocalStorageService } from "./local-storage.service";

export type Friend = GetUsersSelfSelfIdFriends200Item & {
    status: "pending" | "accepted";
};

@Injectable({
    providedIn: "root",
})
export class FriendsService {
    private _friends = signal<Friend[]>([]);
    public friendRequest = computed(() => {
        return this._friends().filter((f) => f.status === "pending");
    });
    private _localStorage = inject(LocalStorageService);

    public async reloadUsers() {
        const userId = this._localStorage.getItem("userInfo")?.id;

        if (userId === undefined) {
            return;
        }

        console.log("userid:", userId)
        const result = await getUsersSelfSelfIdFriends(userId);
        console.log(result.data);

        this._friends.set(result.data as Friend[]);
    }
}
