import { computed, inject, Injectable, signal } from "@angular/core";
import {
    getUsersSelfSelfId,
    GetUsersSelfSelfId200,
} from "../../apiCodegen/backend";
import { LocalStorageService } from "./local-storage.service";
import { MustHaveAuthTranslator } from "../guards/must-have-auth.translations";
import { toast } from "ngx-sonner";
import { SafeRoutingService } from "./safe-routing.service";
import { isAxiosError } from "axios";
import { IconCacheService } from "./icon-cache.service";

export type SelfInfo = GetUsersSelfSelfId200;

@Injectable({
    providedIn: "root",
})
export class SelfService {
    private _localStorage = inject(LocalStorageService);
    private _userInfo = signal<SelfInfo | undefined>(undefined);
    private _safeRouter = inject(SafeRoutingService);
    private _authDict = inject(MustHaveAuthTranslator).dict;
    private _iconService = inject(IconCacheService);

    /**
     * This can only be read from the outside after getting it from
     * waitForUserInfo. Look at its implementation to understand why we can
     * assert it won't be
     * undefined.
     */
    private _assertedUserInfo = computed(() => this._userInfo()!);
    private _readonlyUserInfo = this._userInfo.asReadonly();

    public async waitForUserInfo() {
        if (this._userInfo() === undefined) {
            await this.reloadUserInfo();
        }

        return this._assertedUserInfo;
    }

    public async waitForUserInfoSnapshot() {
        return (await this.waitForUserInfo())();
    }

    public getUserInfo() {
        if (this._userInfo() === undefined) {
            this.reloadUserInfo();
        }

        return this._readonlyUserInfo;
    }

    public async reloadUserInfo() {
        try {
            const id = this._localStorage.getItem("userInfo")?.id;

            if (id === undefined) {
                toast(this._authDict().lacksAuthError);
                this._safeRouter.navigate(["/auth"]);
                return;
            }

            const result = await getUsersSelfSelfId(id);

            this._userInfo.set(result.data);
            return;
        } catch (e) {
            console.error(e);
            if (isAxiosError(e) && e.status === 401) {
                toast(this._authDict().lacksAuthError);
                this._safeRouter.navigate(["/auth"]);
                return;
            }

            toast("Unknown error while loading user info.");
        }
    }

    public async patchUserInfo(newInfo: Partial<SelfInfo>): Promise<void> {
        throw "TODO!" || newInfo;
    }

    public userIconSVG = computed(async () => {
        const info = await this.waitForUserInfoSnapshot();
        console.log("info = " + info);

        return this._iconService.getProfilePicture(info.profilePictureFile);
    });
}
