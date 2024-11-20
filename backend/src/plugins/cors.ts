import fastifyPlugin from "fastify-plugin";
import fastifyCors from "@fastify/cors";

export default fastifyPlugin(async (fastify) => {
    fastify.register(fastifyCors, {
        origin: "TODO",
    });
});
