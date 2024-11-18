import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../../../plugins/swagger.js";
import { decorators } from "../../../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../../../types/params.js";
import { MelodleGuessLineAttemptSchema } from "../../../../../../../../types/melodle.js";
import { guessLineGameInformationSchema } from "../../../../../../../../types/game.js";
import { getGuessLineInformation } from "../../../../../../../../services/game.js";
import { sendError } from "../../../../../../../../utils/reply.js";
import { UnreachableCaseError } from "ts-essentials";
import { runPreparedQuery } from "../../../../../../../../services/database.js";
import { insertGuessLineAttempt } from "../../../../../../../../queries/dml.queries.js";

export default (async (fastify) => {
    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameId"]),
            body: SafeType.Pick(MelodleGuessLineAttemptSchema, ["guessedLine"]),
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
            summary: "Submit a guess for a melodle game.",
            description: undefined,
            tags: ["Melodle"] satisfies MelodleTagName[],
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

            const queryResult = await runPreparedQuery(insertGuessLineAttempt, {
                ...request.params,
                guessedSnippet: request.body.guessedLine,
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
