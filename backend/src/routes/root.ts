import { FastifyPluginAsync } from "fastify";
import { SafeType } from "../utils/typebox.js";
import { MelodleTagNames } from "../plugins/swagger.js";

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get("/", {
        schema: {
            response: {
                200: SafeType.Object({
                    root: SafeType.Literal(true),
                    message: SafeType.Literal("Pong!"),
                }),
            },
            description: "Route to check whether the service is working.",
            summary: "Ping!",
            tags: ["Other"] satisfies MelodleTagNames[],
        },
        handler: async function (_request, _reply) {
            return { root: true, message: "Pong!" };
        },
    });
};

export default root;
