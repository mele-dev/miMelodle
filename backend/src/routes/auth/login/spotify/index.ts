import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../plugins/swagger.js";
import { decorators } from "../../../../services/decorators.js";

const spotifyRoute: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/callback", {
        onRequest: [decorators.noSecurity],
        schema: {
            security: [],
            summary: "We will know what we need here when we get to down to implementation.",
            tags: ["Auth"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
};

export default spotifyRoute;
