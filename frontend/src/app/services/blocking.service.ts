import { inject, Injectable, signal } from "@angular/core";
import { boolean } from "zod";
import { LocalStorageService } from "./local-storage.service";
import { deleteUsersSelfSelfIdBlocksTargetUserId } from "../../apiCodegen/backend";
import { deleteUsersSelfSelfIdBlocksTargetUserIdParams } from "../../apiCodegen/backend-zod";
import { toast } from "ngx-sonner";
import { BlockingTranslationService } from "./blocking-translation.service";

@Injectable({
    providedIn: "root",
})
export class BlockingService {
    private _usersBlocked = signal([]);
    private _localStorage = inject(LocalStorageService);
    dict = inject(BlockingTranslationService).dict;

    public async reloadList() {
        const userId = this._localStorage.getItem("userInfo")?.id;

        if (userId === undefined) {
            return;
        }

        const result = await getUsersSelfSelfIdFriends(userId);

        this._usersBlocked.set(result.data as []);
    }

    public async unblockUser(targetId: number) {
        const userId = this._localStorage.getItem("userInfo")?.id;

        if (userId === undefined) {
            window.location.reload();
            return false;
        }

        try {
            const result = await deleteUsersSelfSelfIdBlocksTargetUserId(
                userId,
                targetId
            );

            await this.reloadList();

            toast(this.dict().unblockSuccess("cambiar aca"));
            return true;
        } catch {
            toast(this.dict().unblockError);
            return false;
        }
    }
}
