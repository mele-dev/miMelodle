import jwt, { FastifyJWTOptions } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin";

export default fp<FastifyJWTOptions>(async (fastify) => {
    fastify.register(jwt, {
        secret: "MYSUPERSECRET",
    });
});
