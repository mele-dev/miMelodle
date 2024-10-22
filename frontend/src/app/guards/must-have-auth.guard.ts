import { CanActivateFn } from "@angular/router";
import { LocalStorageService } from "../services/local-storage.service";
import { inject } from "@angular/core";
import { SafeRoutingService } from "../services/safe-routing.service";
import axios from "axios";

/**
 * Checks that there is an auth token stored in localStorage and adds an
 * interceptor to add that token on every axios request.
 */
export const mustHaveAuthGuard: CanActivateFn = async (_route, _state) => {
    const localStorageService = inject(LocalStorageService);
    const safeRouterService = inject(SafeRoutingService);

    const userInfo = localStorageService.getItem("userInfo");

    if (!userInfo?.jwtToken) {
        safeRouterService.navigate(["/auth"]);
        return false;
    }

    // If the user is already logged in, their token should be injected into
    // every request to the backend.
    axios.interceptors.request.use((config) => {
        // Authorization may be overriden by setting it to anything other than
        // undefined.
        if (config.headers.Authorization === undefined) {
            config.headers.Authorization = "Bearer " + userInfo.jwtToken;
        }
        return config;
    });

    return true;
};
