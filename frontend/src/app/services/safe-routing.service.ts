import { inject, Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { AllMelodlePaths } from "../app.routes";

@Injectable({
    providedIn: "root",
})
export class SafeRoutingService {
    readonly router = inject(Router);

    // TODO
    public navigate<TRoute extends AllMelodlePaths>(
        paths: TRoute[],
        extras?: NavigationExtras
    ) {
        this.router.navigate(paths, extras);
    }


    public createLink<TRoute extends AllMelodlePaths>(path: TRoute) {
        return path;
    }
}
