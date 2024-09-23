import { Type } from "@sinclair/typebox";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { query, runPreparedQuery } from "../../services/database.js";
import { selectUsers } from "../../queries/dml.queries.js";

const tokenSchema = Type.Object({
    jwtToken: Type.String(),
});

const users: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.get('/', {
        async handler (request,reply) {
            const users = await runPreparedQuery(selectUsers, {})
            return reply.code(200).send(users);
        }
    })
};

export default users;