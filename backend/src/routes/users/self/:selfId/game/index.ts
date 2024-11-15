import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../utils/typebox.js";
import {
    MelodleGameSchema,
} from "../../../../../types/melodle.js";
import { decorators } from "../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../types/params.js";
import { MelodleTagName } from "../../../../../plugins/swagger.js";

export default (async (fastify) => {
    fastify.get("/history", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            response: {
                200: SafeType.Array(MelodleGameSchema),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary: "Get a history of your own games.",
            tags: ["User"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
