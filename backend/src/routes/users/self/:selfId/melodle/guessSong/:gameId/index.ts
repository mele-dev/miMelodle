import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { decorators } from "../../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../../types/params.js";
import { SafeType } from "../../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../../plugins/swagger.js";
import { getGuessSongFromUser } from "../../../../../../../queries/dml.queries.js";
import { runPreparedQuery } from "../../../../../../../services/database.js";
import { sendError } from "../../../../../../../utils/reply.js";
import { getSeveralTracks } from "../../../../../../../apiCodegen/spotify.js";
import {
    GuessSongHints,
    guessSongHintsList,
} from "../../../../../../../types/guessSong.js";
import { checkSongGuess } from "../../../../../../../services/game.js";

export default (async (fastify) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameId"]),
            response: {
                200: guessSongHintsList,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary: "Get information about a melodle game.",
            description: undefined,
            tags: ["User", "Melodle"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
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

            const idsToFetch = [hiddenTrackId, ...existingAttemptsIds].join(
                ","
            );

            const tracksInfo = await getSeveralTracks({
                ids: idsToFetch,
            });

            const hiddenTrack = tracksInfo.tracks.find(
                (t) => t.id === hiddenTrackId
            );

            const output: GuessSongHints[] = [];

            for (const id of existingAttemptsIds) {
                const trackToCompare = tracksInfo.tracks.find(
                    (t) => t.id === id
                );

                if (hiddenTrack === undefined || trackToCompare === undefined) {
                    return sendError(
                        reply,
                        "notFound",
                        "Could not find one of the tracks."
                    );
                }

                output.push(
                    checkSongGuess({
                        targetTrack: hiddenTrack,
                        trackToCompare,
                    })
                );
            }

            return output;
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
