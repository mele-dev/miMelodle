import { FastifyPluginAsync } from "fastify";
import { SafeType } from "../../../../utils/typebox.js";
import { MelodleTagNames } from "../../../../plugins/swagger.js";
import { ParamsSchema } from "../../../../types/params.js";

const root: FastifyPluginAsync = async (fastify, _opts): Promise<void> => {
    fastify.get("/:optionalGameMode", {
        schema: {
            params: SafeType.Pick(ParamsSchema, ["optionalGameMode", "selfId"]),
            response: {
                200: SafeType.Object({
                    root: SafeType.Literal(true),
                    message: SafeType.Literal("Pong!"),
                }),
            },
            summary: "Get a history of you own games.",
            tags: ["Other"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
};

export default root;
