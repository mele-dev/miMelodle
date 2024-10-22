import { inject } from "@angular/core";
import { CanActivateFn } from "@angular/router";
import { QueryParamsService } from "../services/query-params.service";

export const errorGuard: CanActivateFn = async (route, _state) => {
    const queryParamsService = inject(QueryParamsService);
    const info = await queryParamsService.coerce(route.queryParams, [
        "code",
        "targetUrl",
    ]);

    if (!info.success) {
        console.error(info.error);
        return true;
    }

    alert("Hubo un error al realizar la acción. Redirigiendo...");

    window.location.href = info.data.targetUrl;
    return true;
};
