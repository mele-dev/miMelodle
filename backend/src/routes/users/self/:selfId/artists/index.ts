import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../../plugins/swagger.js";
import { SafeType } from "../../../../../utils/typebox.js";
import {
    friendSchema,
    selfIdSchema,
    userSchema,
} from "../../../../../types/user.js";
import { decorators } from "../../../../../services/decorators.js";
import { sendError, sendOk } from "../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../services/database.js";
import {
    getBlockedUsers,
    getHomeArtists,
    getSelfFriends,
} from "../../../../../queries/dml.queries.js";
import { artistSchema } from "../../../../../types/artist.js";
import {
    getAnArtist,
    getMultipleArtists,
} from "../../../../../apiCodegen/spotify.js";
import artist from "../../../../artists/index.js";
import { isAxiosError } from "axios";

export default (async (fastify, _opts) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: selfIdSchema,
            tags: ["Artists"] satisfies MelodleTagName[],
            summary: "Get all the artists in a user's home.",
            response: {
                200: SafeType.Array(
                    SafeType.Object({
                        isFavorite: SafeType.Boolean(),
                        data: SafeType.Object({
                            ...SafeType.Pick(artistSchema, [
                                "name",
                                "imageUrl",
                                "externalUrls",
                                "genres",
                                "followers",
                                "spotifyArtistId"
                            ]).properties,
                        }),
                    })
                ),
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
        },
        async handler(request, reply) {
            const queryResult = await runPreparedQuery(
                getHomeArtists,
                request.params
            );

            try {
                const ids = queryResult
                    .map((artist) => artist.spotifyArtistId)
                    .join(",");
                const artistData = await getMultipleArtists({ ids });

                const output = queryResult.map((artist, index) => {
                    return {
                        isFavorite: artist.isFavorite,
                        data: {
                            name: artistData.artists[index]?.name as string,
                            imageUrl: artistData.artists[index]?.images?.[0]
                                ?.url as string | undefined,
                            externalUrls: artistData.artists[index]
                                ?.external_urls?.spotify as string,
                            genres: artistData.artists[index]
                                ?.genres as string[],
                            followers: artistData.artists[index]?.followers
                                ?.total as number,
                            spotifyArtistId: artistData.artists[index]?.id as string
                        },
                    };
                });

                return sendOk(reply, 200, output);
            } catch {
                return sendError(reply,"notFound","There's no artists to get.");
            }
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
