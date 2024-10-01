import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../plugins/swagger.js";
import { ParamsSchema } from "../../../../../../types/params.js";
import { decorators } from "../../../../../../services/decorators.js";

export default (async (fastify) => {
    const isFavoriteSchema = SafeType.Object({
        isFavorite: SafeType.Boolean(),
    });

    fastify.put("/favorite", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, [
                "selfId",
                "artistMusixMatchId",
            ]),
            body: isFavoriteSchema,
            response: {
                200: isFavoriteSchema,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary:
                "Update whether a given artist is within you favorite ones.",
            description: undefined,
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
