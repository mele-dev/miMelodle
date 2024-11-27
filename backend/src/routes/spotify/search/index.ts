import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { decorators } from "../../../services/decorators.js";
import { SafeType } from "../../../utils/typebox.js";
import { queryStringSchema } from "../../../types/querystring.js";
import { PopdleTagName } from "../../../plugins/swagger.js";
import { search, SearchItemsResponse } from "../../../apiCodegen/spotify.js";
import {
    createSpotifyPagination,
    spotifyArtistSchema,
    spotifyTrackSchema,
} from "../../../types/spotify.js";
import { sendOk } from "../../../utils/reply.js";
import { RequireSpotify } from "../../../spotify/helpers.js";
import { hardCodedSettings } from "../../../utils/settings.js";
import { hardCodedSongs } from "../../../hardcoded/hardCodedSongs.js";
import { hardCodedArtists } from "../../../hardcoded/hardcodedArtists.js";

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
                        tracks: createSpotifyPagination(spotifyTrackSchema),
                        artists: createSpotifyPagination(spotifyArtistSchema),
                    } satisfies Partial<
                        Record<keyof SearchItemsResponse, unknown>
                    >)
                ),
                ...SafeType.CreateErrors([]),
            },
            summary: "Query information from spotify.",
            description: undefined,
            tags: ["TODO Schema", "Artists"] satisfies PopdleTagName[],
            security: [],
        },
        async handler(request, reply) {
            if (hardCodedSettings.shouldWorkOffline) {
                const strippedQuery = request.query.query
                    .split("artist:")[0]
                    .toLowerCase()
                    .trim();

                if (request.query.spotifyQueryType.includes("track")) {
                    return sendOk(reply, 200, {
                        tracks: {
                            href: "",
                            total: 50,
                            next: null,
                            previous: null,
                            limit: request.query.pageSize,
                            offset: 0,
                            items: hardCodedSongs.filter((s) =>
                                s.name.toLowerCase().includes(strippedQuery)
                            ),
                        },
                    });
                }

                if (request.query.spotifyQueryType.includes("artist")) {
                    return sendOk(reply, 200, {
                        artists: {
                            href: "",
                            total: 50,
                            next: null,
                            previous: null,
                            limit: request.query.pageSize,
                            offset: 0,
                            items: hardCodedArtists.filter((s) =>
                                s.name.toLowerCase().includes(strippedQuery)
                            ),
                        }
                    });
                }
            }

            const result = (await search({
                q: request.query.query,
                type: request.query.spotifyQueryType,
                limit: request.query.pageSize,
                offset: request.query.page * request.query.pageSize,
            })) as Partial<RequireSpotify<typeof search>>;

            return sendOk(reply, 200, result);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
