import { inject, Injectable, signal } from "@angular/core";
import { boolean } from "zod";
import { LocalStorageService } from "./local-storage.service";
import {
    deleteUsersSelfSelfIdBlockingTargetUserId,
    getUsersSelfSelfIdBlocking,
    GetUsersSelfSelfIdBlocking200Item,
    postUsersSelfSelfIdBlockingTargetUserId,
} from "../../apiCodegen/backend";
import { toast } from "ngx-sonner";
import { BlockingTranslationService } from "./blocking-translation.service";

@Injectable({
    providedIn: "root",
})
export class BlockingService {
    private _blockedUsers = signal<GetUsersSelfSelfIdBlocking200Item[]>([]);
    public blockedUsers = this._blockedUsers.asReadonly();
    private _localStorage = inject(LocalStorageService);
    dict = inject(BlockingTranslationService).dict;

    public async reloadList() {
        const userId = this._localStorage.getItem("userInfo")?.id;

        if (userId === undefined) {
            return;
        }

        const result = await getUsersSelfSelfIdBlocking(userId);

        this._blockedUsers.set(result.data as []);
    }

    public async unblockUser(targetId: number) {
        const userId = this._localStorage.getItem("userInfo")?.id;

        if (userId === undefined) {
            window.location.reload();
            return false;
        }

        try {
            const result = await deleteUsersSelfSelfIdBlockingTargetUserId(
                userId,
                targetId
            );

            await this.reloadList();

            toast(this.dict().unblockSuccess(result.data.username));
            return true;
        } catch {
            toast(this.dict().unblockError);
            return false;
        }
    }

    public async blockUser(targetId: number){
        const selfId = this._localStorage.getItem("userInfo")?.id;
        console.log('AAAAAAA')

        if (selfId === undefined) {
            window.location.reload();
            return false;
        }

        try {
            const result = await postUsersSelfSelfIdBlockingTargetUserId(
                selfId,
                targetId
            );
                console.log('AAAAAAA DPS DE LA QUERY')

            await this.reloadList();

            toast(this.dict().blockSuccess(result.data.username));

            return true;
        } catch {
            toast(this.dict().blockError);
            return false;
        }
    }
}
