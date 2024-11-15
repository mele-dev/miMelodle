import { inject, Injectable } from "@angular/core";
import { NavigationExtras, Router } from "@angular/router";
import { AllMelodlePaths } from "../app.routes";

type ExtractPathParams<TPath extends string> =
    TPath extends `${string}/:${infer Param}/${infer Rest}`
        ? Param | ExtractPathParams<`/${Rest}`>
        : TPath extends `${string}/:${infer Param}`
          ? Param
          : never;

@Injectable({
    providedIn: "root",
})
export class SafeRoutingService {
    readonly router = inject(Router);

    public navigate<TRoute extends AllMelodlePaths | "">(
        path: TRoute,
        extras?: NavigationExtras & {
            ids?: { [K in ExtractPathParams<TRoute>]: string | number };
        }
    ) {
        this.router.navigate([this.createLink(path, extras?.ids)], extras);
    }

    public createLink<TRoute extends AllMelodlePaths | "">(
        path: TRoute,
        ids?: { [K in ExtractPathParams<TRoute>]: string | number }
    ) {
        let builtPath: string = path;
        if (ids) {
            for (const [key, val] of Object.entries<string | number>(ids)) {
                builtPath = builtPath.replace(`:${key}`, val.toString());
            }
        }
        return builtPath;
    }
}
