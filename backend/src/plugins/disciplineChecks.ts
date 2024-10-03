import fastifyPlugin from "fastify-plugin";
import { decorators } from "../services/decorators.js";

export default fastifyPlugin(async (fastify) => {
    fastify.addHook("onRoute", async (route) => {
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
            `Route ${route.path} must specify a request decorator. ` +
                "If you wish to omit decorators, just add a decorator that does nothing, " +
                `like ${decorators.noSecurity.name}`
        );

        await fastify.close();
    });
});
