import { FastifyPluginAsync } from "fastify";
import { SafeType } from "../utils/typebox.js";
import { MelodleTagNames } from "../plugins/swagger.js";

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get("/", {
        schema: {
            response: {
                200: SafeType.Object({ root: SafeType.Literal(true) }),
            },
            description: "Route to check whether the service is working.",
            tags: ["Other"] satisfies MelodleTagNames[]
        },
        handler: async function (_request, _reply) {
            return { root: true };
        },
    });
};

export default root;
