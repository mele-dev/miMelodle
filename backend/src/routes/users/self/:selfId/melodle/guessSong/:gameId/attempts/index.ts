import {
    Boolean,
    FastifyPluginAsyncTypebox,
} from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../../../plugins/swagger.js";
import {
    guessSongHintsSchema,
    MelodleGuessSongAttemptSchema,
} from "../../../../../../../../types/melodle.js";
import { decorators } from "../../../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../../../types/params.js";
import { commonGuessLineProperties } from "../../../../../../../../types/guessLine.js";
import { runPreparedQuery } from "../../../../../../../../services/database.js";
import { getGuessSongFromUser } from "../../../../../../../../queries/dml.queries.js";
import { sendError } from "../../../../../../../../utils/reply.js";
import { getSeveralTracks } from "../../../../../../../../apiCodegen/spotify.js";

export default (async (fastify) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameId"]),
            body: SafeType.Pick(commonGuessLineProperties, [
                "guessedTrackSpotifyId",
            ]),
            response: {
                200: SafeType.Any(),
                //200: SafeType.Pick(commonGuessLineProperties, [
                //    "trackSnippet",
                //    "isCorrectAlbum",
                //    "isCorrectTrack",
                //    "guessedTrackSpotifyId",
                //    "guessedTrackTitleHint",
                //]),
                ...SafeType.CreateErrors([
                    "unauthorized",
                    "notFound",
                    "conflict",
                ]),
            },
            summary: "Submit a guess for a melodle game.",
            description: undefined,
            tags: ["Melodle"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            // All the attempt info is nullable here, pgtyped is dumb with
            // left joins.
            const gameInfo = await runPreparedQuery(
                getGuessSongFromUser,
                request.params
            );

            if (gameInfo.length === 0) {
                return sendError(reply, "notFound", "Could not find game.");
            }

            const hiddenTrackId = gameInfo[0].spotifyTrackId;

            const existingAttemptsIds = gameInfo
                .map((row) => row.guessedSpotifyTrackId)
                .filter((id) => id !== null);

            if (
                existingAttemptsIds.includes(request.body.guessedTrackSpotifyId)
            ) {
                return sendError(
                    reply,
                    "conflict",
                    "You have already guessed that track."
                );
            }

            const tracksInfo = await getSeveralTracks({
                ids: [request.body.guessedTrackSpotifyId, hiddenTrackId].join(
                    ","
                ),
            });

            return {
                tracks: tracksInfo.tracks.map(track => track.name),
            };
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
