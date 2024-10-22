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
} as const;
