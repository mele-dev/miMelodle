import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { ParamsSchema } from "../../types/params.js";
import { artistSchema } from "../../types/artist.js";
import { MelodleTagNames } from "../../plugins/swagger.js";

const artist: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/:artistMusixMatchId", {
        schema: {
            security: [],
            params: SafeType.Pick(ParamsSchema, ["artistMusixMatchId"]),
            summary: "Get information about an artist",
            response: {
                200: SafeType.Pick(artistSchema, [
                    "name",
                    "musixmatchArtistId",
                    "imageUrl",
                ]),
                ...SafeType.CreateErrors(["notFound"]),
            },
            tags: ["TODO Schema"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.get("/search", {
        onRequest: [],
        schema: {
            response: {
                200: SafeType.Literal("TODO!"),
                ...SafeType.CreateErrors([]),
            },
            summary: "Search for available artists.",
            description: undefined,
            tags: ["TODO Schema"] satisfies MelodleTagNames[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        }
    });
};

export default artist;
