import { Route, Routes } from "@angular/router";

import { AuthLayoutComponent } from "./auth/auth-layout/auth-layout.component";
import { LoginPage } from "./auth/login/login.page";
import { RegisterPage } from "./auth/register-page/register.page";
import { TODOComponent } from "./components/todo/todo.component";
import { NotFoundPage } from "./not-found/not-found.page";
import { mustHaveAuthGuard } from "./guards/must-have-auth.guard";
import { authCallbackGuard } from "./guards/auth-callback.guard";
import { AppLayoutPage } from "./app-layout/app-layout.page";
import { authGuard } from "./guards/auth.guard";
import { HomePage } from "./home/home.page";
import { LeaderboardComponent } from "./components/leaderboard/leaderboard.component";
import { GuessSongPage } from "./pages/game/guess-song/guess-song.page";
import { GuessLinePage } from "./pages/game/guess-line/guess-line.page";
import { CreateGamePage } from "./pages/game/create-game/create-game.page";

export const routes = [
    {
        path: "auth",
        component: AuthLayoutComponent,
        canActivate: [authGuard],
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
            {
                path: "callback",
                canActivate: [authCallbackGuard],
                component: TODOComponent,
            },
        ],
    },
    {
        path: "app",
        canActivate: [mustHaveAuthGuard],
        component: AppLayoutPage,
        children: [
            {
                path: "",
                redirectTo: "home",
                pathMatch: "full",
            },
            {
                path: "home",
                component: HomePage,
                title: "Popdle",
            },
            {
                path: "profile",
                component: TODOComponent,
                title: "Your profile",
            },
            {
                path: "leaderboards",
                component: LeaderboardComponent,
                title: "Leaderboards",
            },
            {
                path: "game",
                component: CreateGamePage,
                title: "New game",
            },
            {
                path: "game/guess_line/:gameId",
                component: GuessLinePage,
                title: "Guess a line",
            },
            {
                path: "game/guess_song/:gameId",
                component: GuessSongPage,
                title: "Guess a song",
            },
        ],
    },
    {
        path: "",
        redirectTo: "app",
        pathMatch: "full",
    },
    {
        path: "TODO",
        component: TODOComponent,
    },
    // WARN: This route must always come last, otherwise following pages will be
    // ignored.
    {
        path: "**",
        component: NotFoundPage,
        title: "Not found",
    },
] as const satisfies Routes;
