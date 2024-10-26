import { CanActivateFn } from "@angular/router";

/** Guard to ensure the querystring is processed before components. */
export const queryParamsGuardGuard: CanActivateFn = (route, _state) => {
    console.log("Query params guard:", route.queryParams);
    return true;
};
