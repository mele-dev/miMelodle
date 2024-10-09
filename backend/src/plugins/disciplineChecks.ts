import fastifyPlugin from "fastify-plugin";
import { decorators } from "../services/decorators.js";
import { typedEnv } from "../types/env.js";
import { MelodleTagName } from "./swagger.js";

export default fastifyPlugin(async (fastify) => {
    // No debug in production check.
    if (typedEnv.NODE_ENV === "production") {
        fastify.addHook("onRoute", async (route) => {
            if (
                route.schema?.tags?.includes("Debug" satisfies MelodleTagName)
            ) {
                fastify.log.fatal(
                    `Route ${route.path}: ${route.method} is a debug route enabled in production.`
                );

                await fastify.close();
            }
        });
    }

    // No routes without considering security check.
    fastify.addHook("onRoute", async (route) => {
        // Exclude routes outside our control from this check.
        const pluginRoutes = ["/auth/register/spotify"];
        if (pluginRoutes.includes(route.path)) {
            return;
        }

        // A single function could be an acceptable request.
        if (typeof route.onRequest === "function") {
            return;
        }

        // An array of functions is also fine.
        if (Array.isArray(route.onRequest) && route.onRequest.length > 0) {
            return;
        }

        // At this point, is must either be undefined or an empty array.
        fastify.log.fatal(
            route.onRequest,
            `Route ${route.path} ${route.method} must specify a request decorator. ` +
                "If you wish to omit decorators, just add a decorator that does nothing, " +
                `like ${Object.keys({ decorators })[0]}.${decorators.noSecurity.name}`
        );

        await fastify.close();
    });
});
