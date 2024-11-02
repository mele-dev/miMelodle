import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { ParamsSchema } from "../../types/params.js";
import { artistSchema } from "../../types/artist.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import { decorators } from "../../services/decorators.js";
import MusixmatchAPI from "../../musixmatch-api/musixmatch.js";
import { sendError, sendOk } from "../../utils/reply.js";
import { musixMatchArtistSchema } from "../../types/musixmatch.js";

const artist: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/:artistMusixMatchId", {
        onRequest: [decorators.noSecurity],
        schema: {
            security: [],
            params: SafeType.Pick(ParamsSchema, ["artistMusixMatchId"]),
            summary: "Get information about an artist",
            response: {
                200: musixMatchArtistSchema.properties.artist,
                ...SafeType.CreateErrors([
                    "notFound",
                    "unavailableForLegalReasons",
                ]),
            },
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const musixmatch = new MusixmatchAPI();

            const response = await musixmatch.getArtist({
                artist_id: request.params.artistMusixMatchId,
            });

            if (!response.parse()) {
                return sendError(
                    reply,
                    "unavailableForLegalReasons",
                    "Error while calling musixmatch."
                );
            }

            return sendOk(reply, 200, response.body.artist);
        },
    });

    fastify.get("/artistName", {
        onRequest: [decorators.noSecurity],
        schema: {
            security: [],
            querystring: SafeType.Object({
                query: SafeType.String({ maxLength: 200 }),
            }),
            response: {
                200: SafeType.Array(musixMatchArtistSchema.properties.artist),
                ...SafeType.CreateErrors(["misdirectedRequest"]),
            },
            summary: "Search for artists by name",
            description:
                "Search for artists based on the query provided in the querystring.",
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const musixmatch = new MusixmatchAPI();

            const response = await musixmatch.searchArtist({
                q_artist: request.query.query,
            });

            if (!response.parse()) {
                return sendError(reply, "misdirectedRequest");
            }

            const artists = response.body.artist_list.map(
                (artist) => artist.artist
            );

            return sendOk(reply, 200, artists);
        },
    });

    fastify.get("/search", {
        onRequest: [decorators.noSecurity],
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
