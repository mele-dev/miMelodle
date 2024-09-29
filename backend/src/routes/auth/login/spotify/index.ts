import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import fastify from "fastify";
import { MelodleTagNames } from "../../../../plugins/swagger.js";

const spotifyRoute: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.get("/callback", {
        schema: {
            security: [],
            tags: ["Auth"] satisfies MelodleTagNames[],
        },
        async handler(request, reply) {
            return reply.notImplemented();
        },
    });
};

export default spotifyRoute;
