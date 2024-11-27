import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../utils/typebox.js";
import {
    PopdleGameSchema,
} from "../../../../../types/popdle.js";
import { decorators } from "../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../types/params.js";
import { PopdleTagName } from "../../../../../plugins/swagger.js";

export default (async (fastify) => {
    fastify.get("/history", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId"]),
            response: {
                200: SafeType.Array(PopdleGameSchema),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
            summary: "Get a history of your own games.",
            tags: ["User"] satisfies PopdleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
