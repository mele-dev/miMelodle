import * as path from "path";
import AutoLoad, { AutoloadPluginOptions } from "@fastify/autoload";
import { FastifyPluginAsync, FastifyPluginCallback } from "fastify";
import { fileURLToPath } from "url";
import schemaReferences from "./types/schemaReferences.js";
import plugins from "./plugins/plugins.js";
import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export type AppOptions = {
    // Place your custom options for app below here.
} & Partial<AutoloadPluginOptions>;

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {};

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {

    // Manually load almost everything
    for (const schema of schemaReferences) {
        fastify.addSchema(schema);
    }

    for (const plugin of plugins) {
        fastify.register(plugin);
    }

    // Autoload routes.
    void fastify.register(AutoLoad, {
        dir: path.join(__dirname, "routes"),
        options: opts,
        forceESM: true,
    });
};

export default app;
export { app, options };
