import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { LocalStorageService } from "../services/local-storage.service";
import { toast } from "ngx-sonner";
import { AuthGuardTranslator } from "./auth.translations";
import { SafeRoutingService } from "../services/safe-routing.service";

export const authGuard: CanActivateFn = (_route, _state) => {
    const localStorage = inject(LocalStorageService);
    const dict = inject(AuthGuardTranslator).dict;
    const safeRouter = inject(SafeRoutingService);

    if (localStorage.getItem("userInfo") !== null) {
        toast(dict().alreadyLoggedIn);
        safeRouter.navigate(["/app"]);
        return false;
    }

    return true;
};
