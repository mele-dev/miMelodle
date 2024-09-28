import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { runPreparedQuery } from "../../services/database.js";
import { selectUsers } from "../../queries/dml.queries.js";
import { SafeType } from "../../utils/typebox.js";

const pub: FastifyPluginAsyncTypebox = async (fastify, opts) => {
    fastify.get("/icons/:filename", {
        schema: {
            params: SafeType.Object({
                filename: SafeType.String({
                    pattern: /.*\.svg$/.source,
                    description: "Name of the svg to download.",
                }),
            }),
        },
        async handler(request, reply) {
            const users = await runPreparedQuery(selectUsers, {});
            return reply.code(200).send(users);
        },
    });
};

export default pub;
