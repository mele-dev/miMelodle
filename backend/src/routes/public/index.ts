import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import {
    getAllUserIconsFileNames,
    getIconFromFile,
} from "../../services/files.js";
import { sendError } from "../../utils/errors.js";
import { profilePictureSchema, svgSchema } from "../../types/public.js";
import { runPreparedQuery } from "../../services/database.js";
import { selectAllIcons } from "../../queries/dml.queries.js";
import { MelodleTagNames } from "../../plugins/swagger.js";

const pub: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/icons/:filename", {
        schema: {
            description:
                "Get the svg for a certain user icon. The selection of user icons is fixed.",
            summary: "Get a user icon.",
            params: SafeType.Object({
                filename: SafeType.StringEnum(getAllUserIconsFileNames(), {
                    description: "Name of the svg to download.",
                }),
            }),
            tags: ["Static"] satisfies MelodleTagNames[],
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
            return reply
                .code(200)
                .send(getIconFromFile(request.params.filename));
        },
    });

    fastify.get("/icons", {
        schema: {
            summary: "Get information about all user icons.",
            tags: ["Static"] satisfies MelodleTagNames[],
            response: {
                200: SafeType.Array(profilePictureSchema),
            },
        },
        async handler(_request, reply) {
            const result = await runPreparedQuery(selectAllIcons, {});
            return reply.code(200).send(result);
        },
    });
};

export default pub;
