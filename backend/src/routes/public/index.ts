import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import {
    getAllUserIconsFileNames,
    getIconFromFile,
} from "../../services/files.js";
import { sendError, sendOk } from "../../utils/reply.js";
import { profilePictureSchema, svgSchema } from "../../types/public.js";
import { runPreparedQuery } from "../../services/database.js";
import { selectAllIcons } from "../../queries/dml.queries.js";
import { PopdleTagName } from "../../plugins/swagger.js";
import { decorators } from "../../services/decorators.js";

const pub: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/icons/:filename", {
        onRequest: [decorators.noSecurity],
        schema: {
            description:
                "Get the svg for a certain user icon. The selection of user icons is fixed.",
            summary: "Get a user icon.",
            params: SafeType.Object({
                filename: SafeType.StringEnum(getAllUserIconsFileNames(), {
                    description: "Name of the svg to download.",
                }),
            }),
            tags: ["Static"] satisfies PopdleTagName[],
            security: [],
            response: {
                200: svgSchema,
                ...SafeType.CreateErrors(["notFound"]),
            },
        },
        async handler(request, reply) {
            const icon = getIconFromFile(request.params.filename);

            if (icon === undefined) {
                return sendError(
                    reply,
                    "notFound",
                    "The speccified file does not exist."
                );
            }

            return sendOk(reply, 200, icon);
        },
    });

    fastify.get("/icons", {
        onRequest: [decorators.noSecurity],
        schema: {
            summary: "Get information about all user icons.",
            tags: ["Static"] satisfies PopdleTagName[],
            security: [],
            response: {
                200: SafeType.WithExamples(
                    SafeType.Array(profilePictureSchema),
                    [await runPreparedQuery(selectAllIcons, {})]
                ),
            },
        },
        async handler(_request, reply) {
            const result = await runPreparedQuery(selectAllIcons, {});
            return sendOk(reply, 200, result);
        },
    });
};

export default pub;
