import { CanActivateFn } from "@angular/router";
import { inject } from "@angular/core";
import { SafeRoutingService } from "../services/safe-routing.service";
import { LocalStorageService } from "../services/local-storage.service";
import { QueryParamsService } from "../services/query-params.service";

export const authCallbackGuardGuard: CanActivateFn = async (route, _state) => {
    const paramsService = inject(QueryParamsService);
    const safeRouter = inject(SafeRoutingService);
    const localStorageService = inject(LocalStorageService);

    alert(JSON.stringify(route.queryParams));

    const parsed = await paramsService.coerce(route.queryParams, [
        "jwtToken",
        "selfId",
    ]);

    console.log(parsed);
    alert(parsed.data);

    if (!parsed.success) {
        alert("Error al realizar acción. Redirigiendo a login... (TODO)");
        safeRouter.navigate(["/auth/"]);
        return false;
    }

    alert(parsed.data);

    localStorageService.setItem("userInfo", {
        ...parsed.data,
        id: parsed.data.selfId,
    });

    safeRouter.navigate(["/app"]);
    return true;
};
