import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../../plugins/swagger.js";
import { SafeType } from "../../../../../utils/typebox.js";
import { selfIdSchema } from "../../../../../types/user.js";
import { decorators } from "../../../../../services/decorators.js";
import { sendError, sendOk } from "../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../services/database.js";
import { getHomeArtists } from "../../../../../queries/dml.queries.js";
import { getMultipleArtists } from "../../../../../apiCodegen/spotify.js";
import { spotifyArtistSchema } from "../../../../../types/spotify.js";
import { RequireSpotify } from "../../../../../spotify/helpers.js";

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
                        ...spotifyArtistSchema.properties,
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

            if (queryResult.length === 0) {
                return sendError(
                    reply,
                    "notFound",
                    "There's no artists to get."
                );
            }

            const ids = queryResult
                .map((artist) => artist.spotifyArtistId)
                .join(",");
            const artistData = (await getMultipleArtists({
                ids,
            })) as RequireSpotify<typeof getMultipleArtists>;

            const output = queryResult.map((artist, index) => {
                return {
                    isFavorite: artist.isFavorite,
                    ...artistData.artists[index],
                };
            });

            return sendOk(reply, 200, output);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
