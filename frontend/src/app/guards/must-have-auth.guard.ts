import { CanActivateFn } from "@angular/router";
import { LocalStorageService } from "../services/local-storage.service";
import { inject } from "@angular/core";
import { SafeRoutingService } from "../services/safe-routing.service";

export const mustHaveAuthGuard: CanActivateFn = (_route, _state) => {
    const localStorageService = inject(LocalStorageService);
    const safeRouterService = inject(SafeRoutingService);

    if (localStorageService.getItem("userInfo") === null) {
        safeRouterService.navigate(["/auth"]);
    }
    // TODO: Ask the backend if the token is valid.
    return true;
};
