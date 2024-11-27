import { inject, Injectable } from "@angular/core";
import { NavigationExtras, Route, Router, Routes } from "@angular/router";
import { routes } from "../app.routes";


export type AllPopdlePaths = ExtractRoutes<typeof routes>;

// Extract ALL paths (including those without components)
type ExtractAllPaths<TRoute extends Route, TBasePath extends string = ""> =
    // If the route has children, extract from children recursively
    TRoute extends {
        path: infer P;
        children: infer C extends Routes;
    }
        ?
              | `${TBasePath}/${P & string}`
              | ExtractRoutes<C, `${TBasePath}/${P & string}`>
        : // Otherwise, return the current path
          TRoute extends { path: infer P }
          ? `${TBasePath}/${P & string}`
          : never;

// Helper to iterate over all routes and apply the extraction logic
type ExtractRoutes<
    TRoutes extends Routes,
    TBasePath extends string = "",
> = TRoutes[number] extends infer R extends Route
    ? ExtractAllPaths<R, TBasePath>
    : never;

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

    public navigate<TRoute extends AllPopdlePaths | "">(
        path: TRoute,
        extras?: NavigationExtras & {
            ids?: { [K in ExtractPathParams<TRoute>]: string | number };
        }
    ) {
        this.router.navigate([this.createLink(path, extras?.ids)], extras);
    }

    public createLink<TRoute extends AllPopdlePaths | "">(
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

    public get url(): string {
        return this.router.url;
    }
}
