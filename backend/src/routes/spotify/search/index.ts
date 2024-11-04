import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { decorators } from "../../../services/decorators.js";
import { SafeType } from "../../../utils/typebox.js";
import { queryStringSchema } from "../../../types/querystring.js";
import { MelodleTagName } from "../../../plugins/swagger.js";
import { search, SearchItemsResponse } from "../../../apiCodegen/spotify.js";
import { createSpotifyPagination } from "../../../types/spotify.js";
import { sendOk } from "../../../utils/reply.js";
import { DeepRequired } from "ts-essentials";
import { artistSchema } from "../../../types/artist.js";

export default (async (fastify) => {
    fastify.get("", {
        onRequest: [decorators.noSecurity],
        schema: {
            querystring: SafeType.Pick(queryStringSchema, [
                "page",
                "pageSize",
                "query",
                "spotifyQueryType",
            ]),
            response: {
                200: SafeType.Partial(SafeType.Object({
                    shows: createSpotifyPagination(SafeType.TODO),
                    albums: createSpotifyPagination(SafeType.TODO),
                    tracks: createSpotifyPagination(SafeType.TODO),
                    artists: createSpotifyPagination(SafeType.Pick(artistSchema, [
                        "id",
                        "name",
                        "genres",
                        "imageUrl",
                        "externalUrls",
                        "artistIsrc",
                        "followers",
                        "spotifyArtistId",
                    ])),
                    episodes: createSpotifyPagination(SafeType.TODO),
                    playlists: createSpotifyPagination(SafeType.TODO),
                    audiobooks: createSpotifyPagination(SafeType.TODO),
                } satisfies Record<keyof SearchItemsResponse, unknown>)),
                ...SafeType.CreateErrors([]),
            },
            summary: "TODO!",
            description: undefined,
            tags: ["TODO Schema", "Artists"] satisfies MelodleTagName[],
            security: [],
        },
        async handler(request, reply) {
            // TODO: I LEFT HERE (CR).
            const result = await search({
                q: request.query.query,
                type: request.query.spotifyQueryType,
                limit: request.query.pageSize,
                offset: request.query.page * request.query.pageSize,
            });

            return sendOk(reply, 200, result as DeepRequired<typeof result>);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
