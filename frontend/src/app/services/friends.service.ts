import {
    computed,
    effect,
    inject,
    Injectable,
    OnInit,
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
export class FriendsService implements OnInit {
    private _friends = signal<Friend[]>([]);
    public friendRequest = computed(() => {
        return this._friends().filter((f) => f.status === "pending");
    });
    private _localStorage = inject(LocalStorageService);

    constructor() {}

    async ngOnInit() {
        const userId = this._localStorage.getItem("userInfo")?.id;

        if (userId === undefined) {
            return;
        }

        const result = await getUsersSelfSelfIdFriends(userId);

        this._friends.set(result.data as Friend[]);
    }
}
