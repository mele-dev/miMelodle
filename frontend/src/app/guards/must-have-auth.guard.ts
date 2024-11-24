import { CanActivateFn } from "@angular/router";
import { LocalStorageService } from "../services/local-storage.service";
import { inject } from "@angular/core";
import { SafeRoutingService } from "../services/safe-routing.service";
import axios from "axios";
import { MustHaveAuthTranslator } from "./must-have-auth.translations";
import { toast } from "ngx-sonner";

/**
 * Checks that there is an auth token stored in localStorage and adds an
 * interceptor to add that token on every axios request.
 */
export const mustHaveAuthGuard: CanActivateFn = async (_route, _state) => {
    const localStorageService = inject(LocalStorageService);
    const safeRouterService = inject(SafeRoutingService);
    const dict = inject(MustHaveAuthTranslator).dict;

    const userInfo = localStorageService.getItem("userInfo");

    if (!userInfo?.jwtToken) {
        toast(dict().lacksAuthError);
        safeRouterService.navigate("/auth");
        return false;
    }

    return true;
};
