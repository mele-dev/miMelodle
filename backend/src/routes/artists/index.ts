import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../utils/typebox.js";
import { ParamsSchema } from "../../types/params.js";
import { artistSchema } from "../../types/artist.js";
import { MelodleTagName } from "../../plugins/swagger.js";
import { decorators } from "../../services/decorators.js";
import MusixmatchAPI from "../../musixmatch-api/musixmatch.js";
import { sendOk } from "../../utils/reply.js";

const artist: FastifyPluginAsyncTypebox = async (fastify, _opts) => {
    fastify.get("/:artistMusixMatchId", {
        onRequest: [decorators.noSecurity],
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
        async handler(request, reply) {
            const { artistMusixMatchId } = request.params;
            const musixmatch = new MusixmatchAPI();

            const response = await musixmatch.getArtistById(artistMusixMatchId);

            const artist = {
                musixmatchArtistId: response.artist.artist_id,
                name: response.artist.artist_name,
                imageUrl: response.artist.artist_image_url,
            };

            return reply.send(artist);
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
                200: SafeType.Array(
                    SafeType.Pick(artistSchema, [
                        "musixmatchArtistId",
                        "name",
                        "imageUrl",
                    ])
                ),
                ...SafeType.CreateErrors([]),
            },
            summary: "Search for artists by name",
            description:
                "Search for artists based on the query provided in the querystring.",
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const { query } = request.query;
            const musixmatch = new MusixmatchAPI();

            const response = await musixmatch.artistQuery(query);

            const artists = response.artist_list.map((artist) => ({
                musixmatchArtistId: artist.artist.artist_id,
                name: artist.artist.artist_name,
                imageUrl: artist.artist.artist_image_url,
            }));

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
