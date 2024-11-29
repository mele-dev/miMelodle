import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../../../utils/typebox.js";
import { PopdleTagName } from "../../../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../../../types/params.js";
import { PopdleGuessLineAttemptSchema } from "../../../../../../../../types/popdle.js";
import { guessLineGameInformationSchema } from "../../../../../../../../types/game.js";
import { getGuessLineInformation } from "../../../../../../../../services/game.js";
import { sendError } from "../../../../../../../../utils/reply.js";
import { UnreachableCaseError } from "ts-essentials";
import { runPreparedQuery } from "../../../../../../../../services/database.js";
import { insertGuessLineAttempt } from "../../../../../../../../queries/dml.queries.js";
import { calculateScoreDecrement, calculateScoreIncrement } from "../../../../../../../../services/score.js";

export default (async (fastify) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameId"]),
            body: SafeType.Pick(PopdleGuessLineAttemptSchema, ["guessedLine"]),
            response: {
                201: guessLineGameInformationSchema,
                ...SafeType.CreateErrors([
                    "unauthorized",
                    "badRequest",
                    "notFound",
                    "conflict",
                    "gone",
                    "internalServerError",
                ]),
            },
            summary: "Submit a guess for a popdle game.",
            description: undefined,
            tags: ["Popdle"] satisfies PopdleTagName[],
        },
        async handler(request, reply) {
            const result = await getGuessLineInformation({
                ...request.params,
                newGuess: request.body.guessedLine,
            });

            switch (result.status) {
                case "RepeatedLine":
                    return sendError(reply, "conflict", result.status);
                case "NoGame":
                    return sendError(reply, "notFound", result.status);
                case "AttemptsExhausted":
                    return sendError(reply, "gone", result.status);
                case "AlreadyWon":
                    return sendError(reply, "gone", result.status);
                case "WrongGuessLength":
                    return sendError(reply, "badRequest", result.status);
                case "NotYourGame":
                    return sendError(reply, "unauthorized", result.status);
                case "Success":
                    break;
                default:
                    throw new UnreachableCaseError(result);
            }

            let scoreDeviation = 0;

            if (result.hints.hasWon) {
                scoreDeviation = calculateScoreIncrement(
                    result.hints.currentScore,
                    result.hints.attempts.length
                );
            }

            if (result.hints.hasLost) {
                scoreDeviation = calculateScoreDecrement(
                    result.hints.currentScore,
                );
            }

            const queryResult = await runPreparedQuery(insertGuessLineAttempt, {
                ...request.params,
                guessedSnippet: request.body.guessedLine,
                scoreDeviation,
            });

            if (queryResult.length !== 1) {
                // I'm not sure which code to use here.
                return sendError(
                    reply,
                    "internalServerError",
                    "We could not store the attempt"
                );
            }

            return result.hints;
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
