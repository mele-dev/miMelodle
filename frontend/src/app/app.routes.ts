import { Route, Routes } from "@angular/router";

import { AuthLayoutComponent } from "./auth/auth-layout/auth-layout.component";
import { LoginPage } from "./auth/login/login.page";
import { RegisterPage } from "./auth/register-page/register.page";
import { TODOComponent } from "./components/todo/todo.component";
import { NotFoundPage } from "./not-found/not-found.page";

export const routes = [
    {
        path: "auth",
        component: AuthLayoutComponent,
        children: [
            {
                path: "",
                redirectTo: "login",
                pathMatch: "full",
            },
            {
                path: "register",
                component: RegisterPage,
                title: "Create Account",
            },
            {
                path: "login",
                component: LoginPage,
                title: "Log in",
            },
        ],
    },
    {
        path: "app",
        // Component for layout (navbar)
        component: TODOComponent,
        children: [
            {
                path: "",
                redirectTo: "home",
                pathMatch: "full",
            },
            {
                path: "home",
                component: TODOComponent,
            },
            {
                path: "profile",
                component: TODOComponent,
            },
        ],
    },
    {
        path: "",
        component: TODOComponent,
    },
    // WARN: This route must always come last, otherwise following pages will be
    // ignored.
    {
        path: "**",
        component: NotFoundPage,
    },
] as const satisfies Routes;

export type AllMelodlePaths = ExtractRoutes<typeof routes>;

// WARN: The below is made by ChatGPT. It seems to work, though.

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
