import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { decorators } from "../../../services/decorators.js";
import { SafeType } from "../../../utils/typebox.js";
import { queryStringSchema } from "../../../types/querystring.js";
import { MelodleTagName } from "../../../plugins/swagger.js";
import { search, SearchItemsResponse } from "../../../apiCodegen/spotify.js";
import { createSpotifyPagination } from "../../../types/spotify.js";
import { sendOk } from "../../../utils/reply.js";
import { artistSchema } from "../../../types/artist.js";
import { RequireSpotify } from "../../../spotify/helpers.js";

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
                200: SafeType.Partial(
                    SafeType.Object({
                        artists: createSpotifyPagination(
                            SafeType.Pick(artistSchema, [
                                "name",
                                "spotifyArtistId",
                                "genres",
                                "followers",
                                "popularity",
                                "images",
                                "externalUrls",
                            ])
                        ),
                    } satisfies Partial<
                        Record<keyof SearchItemsResponse, unknown>
                    >)
                ),
                ...SafeType.CreateErrors([]),
            },
            summary: "Query information from spotify.",
            description: undefined,
            tags: ["TODO Schema", "Artists"] satisfies MelodleTagName[],
            security: [],
        },
        async handler(request, reply) {
            const result = (await search({
                q: request.query.query,
                type: request.query.spotifyQueryType,
                limit: request.query.pageSize,
                offset: request.query.page * request.query.pageSize,
            })) as Partial<RequireSpotify<typeof search>>;

            return sendOk(reply, 200, {
                artists: result.artists
                    ? {
                          ...result.artists,
                          items: result?.artists.items.map((item) => ({
                              ...item,
                              spotifyArtistId: item.id,
                              externalUrls: item.external_urls,
                          })),
                      }
                    : undefined,
            });
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
