import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../../../utils/typebox.js";
import { MelodleTagNames } from "../../../../../../../../plugins/swagger.js";
import { MelodleAttemptSchema } from "../../../../../../../../types/melodle.js";

export default (async (fastify) => {
    fastify.post("", {
        onRequest: [],
        schema: {
            body: MelodleAttemptSchema,
            response: {
                200: SafeType.Literal("Success"),
                ...SafeType.CreateErrors([]),
            },
            summary: "Submit a guess for a melodle game.",
            description: "Submit user attempts for guessing the song in a melodle game.",
            tags: ["Juana"] satisfies MelodleTagNames[],
            params: SafeType.Object({
                selfId: SafeType.String({ description: "ID of the user" }),
                gameId: SafeType.String({ description: "ID of the melodle game" })
            })
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        }
    });
}) satisfies FastifyPluginAsyncTypebox;
