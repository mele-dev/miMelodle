import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../../../types/params.js";
import {
    commonGamePropertiesSchema,
    guessSongGameInformationSchema,
} from "../../../../../../../../types/game.js";
import { runPreparedQuery } from "../../../../../../../../services/database.js";
import { sendError, sendOk } from "../../../../../../../../utils/reply.js";
import { insertGuessSongAttempt } from "../../../../../../../../queries/dml.queries.js";
import { getGuessSongInformation } from "../../../../../../../../services/game.js";
import { UnreachableCaseError } from "ts-essentials";
import {
    calculateScoreDecrement,
    calculateScoreIncrement,
} from "../../../../../../../../services/score.js";

export default (async (fastify) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameId"]),
            body: SafeType.Pick(commonGamePropertiesSchema, [
                "guessedTrackSpotifyId",
            ]),
            response: {
                201: guessSongGameInformationSchema,
                ...SafeType.CreateErrors([
                    "internalServerError",
                    "unauthorized",
                    "notFound",
                    "conflict",
                    "failedDependency",
                    "gone",
                ]),
            },
            summary: "Submit a guess for a melodle game.",
            description: undefined,
            tags: ["Melodle"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const result = await getGuessSongInformation({
                ...request.params,
                newGuess: request.body.guessedTrackSpotifyId,
            });

            switch (result.status) {
                case "RepeatedTrack":
                    return sendError(reply, "conflict", result.status);
                case "NoGame":
                    return sendError(reply, "notFound", result.status);
                case "AttemptsExhausted":
                    return sendError(reply, "gone", result.status);
                case "TrackNotFound":
                    return sendError(reply, "notFound", result.status);
                case "AlreadyWon":
                    return sendError(reply, "gone", result.status);
                case "NotYourGame":
                    return sendError(reply, "unauthorized", result.status);
                case "Success":
                    break;
                default:
                    throw new UnreachableCaseError(result);
            }

            const hasWon = result.hints.attempts.some((a) => a.isCorrectTrack);
            const hasLost = !hasWon && result.hints.attempts.length === 6;

            let scoreDeviation = 0;

            if (hasWon) {
                scoreDeviation = calculateScoreIncrement(
                    result.hints.currentScore,
                    result.hints.attempts.length
                );
            }

            if (hasLost) {
                scoreDeviation = calculateScoreDecrement(
                    result.hints.currentScore
                );
            }

            const queryResult = await runPreparedQuery(insertGuessSongAttempt, {
                ...request.params,
                trackId: request.body.guessedTrackSpotifyId,
                scoreDeviation,
            });

            if (queryResult.length !== 1) {
                return sendError(
                    reply,
                    "internalServerError",
                    "We could not store the attempt"
                );
            }

            if (
                queryResult[0].guessedSpotifyTrackId ===
                request.body.guessedTrackSpotifyId
            )
                return sendOk(reply, 201, result.hints);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
