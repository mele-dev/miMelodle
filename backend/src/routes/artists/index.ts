import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { ParamsSchema } from "../../types/params.js";
import { artistSchema } from "../../types/artist.js";
import { MelodleTagName } from "../../plugins/swagger.js";

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
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.get("/search", {
        onRequest: [],
        schema: {
            security: [],
            querystring: SafeType.Object({
                query: SafeType.String({ maxLength: 500 }),
            }),
            response: {
                200: SafeType.Array(
                    SafeType.Pick(artistSchema, [
                        "musixmatchArtistId",
                        "name",
                        "imageUrl",
                    ])
                ),
                ...SafeType.CreateErrors([]),
            },
            summary: "Search for available artists.",
            description:
                "We use a custom algorithm to determine which artists are most relevant, " +
                "based off the query in the querystring.",
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });
};

export default artist;
