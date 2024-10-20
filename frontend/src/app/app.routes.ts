import { Routes, Route } from "@angular/router";
import { RegisterPage } from "./auth/register-page/register.page";
import { TODOComponent } from "./components/todo/todo.component";
import { AuthLayoutComponent } from "./auth/auth-layout/auth-layout.component";
import { LoginPage } from "./auth/login/login.page";

// Example routes
export const routes = [
    {
        path: "auth",
        component: AuthLayoutComponent,
        children: [
            {
                path: "register",
                component: RegisterPage, // This should be included for component-based extraction
                title: "Create Account",
            },
            {
                path: "login", // No component here, will be excluded in the component-based result
                component: LoginPage,
                title: "Log in",
            },
        ],
    },
    {
        path: "",
        component: TODOComponent,
    }
] as const satisfies Routes;

export type AllMelodlePaths = ExtractRoutes<typeof routes>;
export type MelodlePages = ExtractComponentRoutes<typeof routes>;

// WARN: The below is made by ChatGPT. It seems to work, though.

// Extract ALL paths (including those without components)
type ExtractAllPaths<TRoute extends Route, TBasePath extends string = ""> =
    // If the route has children, extract from children recursively
    TRoute extends { path: infer P; children: infer C extends Routes }
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

// Extract ONLY paths with components
type ExtractComponentPaths<
    TRoute extends Route,
    TBasePath extends string = "",
> =
    // If the route has a component, include its path
    TRoute extends { path: infer P; component: any }
        ? `${TBasePath}/${P & string}`
        : // If it has children, recurse to extract paths with components
          TRoute extends { path: infer P; children: infer C extends Routes }
          ? ExtractComponentRoutes<C, `${TBasePath}/${P & string}`>
          : never;

// Helper to iterate over the routes array and apply the component filter logic
type ExtractComponentRoutes<
    TRoutes extends Routes,
    TBasePath extends string = "",
> = TRoutes[number] extends infer R extends Route
    ? ExtractComponentPaths<R, TBasePath>
    : never;
