import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../plugins/swagger.js";
import { ParamsSchema } from "../../../../../../types/params.js";
import { decorators } from "../../../../../../services/decorators.js";
import { artistSchema } from "../../../../../../types/artist.js";
import { runPreparedQuery } from "../../../../../../services/database.js";
import { sendError, sendOk } from "../../../../../../utils/reply.js";
import {
    addArtistToHome,
    deleteArtistFromHome,
    changeFavorite,
    countFavorites,
} from "../../../../../../queries/dml.queries.js";
import { getAnArtist } from "../../../../../../apiCodegen/spotify.js";
import { getSeveralMaybeHardCodedArtists } from "../../../../../../hardcoded/hardCodedUtils.js";

export default (async (fastify) => {
    const isFavoriteSchema = SafeType.Object({
        isFavorite: SafeType.Boolean(),
    });

    fastify.put("/favorite", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "spotifyArtistId"]),
            body: isFavoriteSchema,
            response: {
                200: isFavoriteSchema,
                ...SafeType.CreateErrors([
                    "unauthorized",
                    "notFound",
                    "forbidden",
                ]),
            },
            summary:
                "Update whether a given artist is within you favorite ones.",
            description: undefined,
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async preHandler(request, reply) {
            if (request.body.isFavorite === true) {
                const quantity = await runPreparedQuery(
                    countFavorites,
                    request.params
                );

                if (quantity[0].count! >= 4) {
                    return sendError(
                        reply,
                        "forbidden",
                        "You reached the maximum of favorite artists allowed."
                    );
                }
            }
        },
        async handler(request, reply) {
            const queryResult = await runPreparedQuery(changeFavorite, {
                ...request.body,
                ...request.params,
            });

            if (!queryResult[0].isFavorite) {
                return sendOk(reply, 200, { isFavorite: false });
            } else if (queryResult[0].isFavorite) {
                return sendOk(reply, 200, { isFavorite: true });
            }

            return sendError(
                reply,
                "notFound",
                "Could not find artist with such an id."
            );
        },
    });

    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "spotifyArtistId"]),
            response: {
                200: SafeType.Pick(artistSchema, ["name"]),
                ...SafeType.CreateErrors([
                    "unauthorized",
                    "notFound",
                    "badRequest",
                ]),
            },
            summary:
                "Add an artist to user's home page (for non-Spotify users mostly).",
            description: undefined,
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            try {
                const artist = await getSeveralMaybeHardCodedArtists([
                    request.params.spotifyArtistId,
                ]);

                const queryResult = await runPreparedQuery(addArtistToHome, {
                    selfId: request.params.selfId,
                    artists: [request.params.spotifyArtistId],
                });

                return sendOk(reply, 200, { name: artist[0].name! });
            } catch {
                return sendError(reply, "badRequest", "Already added artist.");
            }
        },
    });

    fastify.delete("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "spotifyArtistId"]),
            response: {
                200: SafeType.Object({ deleted: SafeType.Boolean() }),
                ...SafeType.CreateErrors([
                    "unauthorized",
                    "notFound",
                    "badRequest",
                ]),
            },
            summary: "Delete an artist from user's home.",
            description: undefined,
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const queryResult = await runPreparedQuery(
                deleteArtistFromHome,
                request.params
            );

            switch (queryResult.length) {
                case 0:
                    return sendError(
                        reply,
                        "notFound",
                        "Could not delete target artist from home."
                    );
                case 1:
                    return sendOk(reply, 200, {
                        deleted: true,
                    });
                default:
                    throw `Deleted ${queryResult.length} rows.`;
            }
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
