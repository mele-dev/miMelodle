import { URLSearchParams } from "url";
import { typedEnv } from "../types/env.js";

export const frontendPaths = {
    authCallback(params: { selfId: number; jwtToken: string }) {
        return `https://${typedEnv.FRONT_URL}/auth/callback?selfId=${params.selfId}&jwtToken=${params.jwtToken}` as const;
    },
    errorCallback(params: { code: number; targetUrl: string }) {
        return `https://${typedEnv.FRONT_URL}/errors?code=${params.code}&targetUrl=${params.targetUrl}` as const;
    },
    auth: `https://${typedEnv.FRONT_URL}/auth`,
    login: `https://${typedEnv.FRONT_URL}/auth/login`,
    register: `https://${typedEnv.FRONT_URL}/auth/register`,

    generalSearchParams(params: {
        errorMessage?: string;
        errorEnum?: "spotify_taken" | "invalid_credentials" | "no_user_spotify";
    }) {
        const paramsBuilder = new URLSearchParams();

        for (const [key, val] of Object.entries(params)) {
            paramsBuilder.append(key, val);
        }

        return paramsBuilder.toString();
    },
} as const;
