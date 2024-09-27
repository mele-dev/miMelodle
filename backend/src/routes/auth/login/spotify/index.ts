import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import fastify from "fastify";

const spotifyRoute : FastifyPluginAsyncTypebox = async(fastify,opts) => {
    fastify.get('/callback', async function (request,reply) {
        return reply.notImplemented();
    })
}

export default spotifyRoute;