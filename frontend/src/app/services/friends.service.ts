import { computed, inject, Injectable, signal } from "@angular/core";
import {
    deleteUsersSelfSelfIdFriendsTargetUserId,
    getUsersSelfSelfIdFriends,
    GetUsersSelfSelfIdFriends200Item,
    postUsersSelfSelfIdFriendsTargetUserId,
    putUsersSelfSelfIdFriendsTargetUserId,
} from "../../apiCodegen/backend";
import { LocalStorageService } from "./local-storage.service";
import { toast } from "ngx-sonner";
import { FriendsTranslator } from "./friends.translation";

export type Friend = GetUsersSelfSelfIdFriends200Item & {
    status: "pending" | "accepted";
};

@Injectable({
    providedIn: "root",
})
export class FriendsService {
    private _friends = signal<Friend[]>([]);
    public friendRequests = computed(() => {
        return this._friends().filter(
            (f) => f.status === "pending" && !f.selfIsRequestSender
        );
    });
    public friends = this._friends.asReadonly();
    private _localStorage = inject(LocalStorageService);
    dict = inject(FriendsTranslator).dict;

    public async reloadUsers() {
        const userId = this._localStorage.getItem("userInfo")?.id;

        if (userId === undefined) {
            return;
        }

        const result = await getUsersSelfSelfIdFriends(userId);

        this._friends.set(result as Friend[]);
    }

    public async acceptFriendRequest(targetId: number) {
        const selfId = this._localStorage.getItem("userInfo")?.id;

        if (selfId === undefined) {
            window.location.reload();
            return false;
        }

        try {
            const result = await putUsersSelfSelfIdFriendsTargetUserId(
                selfId,
                targetId
            );

            await this.reloadUsers();

            toast(this.dict().acceptFriendRequestSuccess(result.username));

            return true;
        } catch {
            toast(this.dict().acceptFriendRequestError);
            return false;
        }
    }

    public async sendFriendRequest(targetId: number) {
        const selfId = this._localStorage.getItem("userInfo")?.id;

        if (selfId === undefined) {
            window.location.reload();
            return false;
        }

        try {
            const result = await postUsersSelfSelfIdFriendsTargetUserId(
                selfId,
                targetId
            );

            await this.reloadUsers();

            toast(this.dict().sendFriendRequestSucces(result.username));

            return true;
        } catch {
            toast(this.dict().sendFriendRequestError);
            return false;
        }
    }

    public async deleteFriend(targetId: number) {
        const selfId = this._localStorage.getItem("userInfo")?.id;

        if (selfId === undefined) {
            window.location.reload();
            return false;
        }

        try {
            const result = await deleteUsersSelfSelfIdFriendsTargetUserId(
                selfId,
                targetId
            );

            await this.reloadUsers();

            toast(this.dict().deleteFriendSuccess(result.username));

            return true;
        } catch {
            toast(this.dict().deleteFriendError);
            return false;
        }
    }
}
