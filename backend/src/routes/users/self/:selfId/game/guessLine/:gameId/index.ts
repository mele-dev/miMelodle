import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { decorators } from "../../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../../types/params.js";
import { SafeType } from "../../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../../plugins/swagger.js";
import { sendError, sendOk } from "../../../../../../../utils/reply.js";
import { guessLineGameInformationSchema } from "../../../../../../../types/game.js";
import { getGuessLineInformation } from "../../../../../../../services/game.js";
import { UnreachableCaseError } from "ts-essentials";

export default (async (fastify) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameId"]),
            response: {
                200: guessLineGameInformationSchema,
                ...SafeType.CreateErrors(["unauthorized", "notFound", "badRequest"]),
            },
            summary: "Get information about a guess line game.",
            description: undefined,
            tags: ["User", "Melodle"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const result = await getGuessLineInformation(request.params);
            switch (result.status) {
                case "AttemptsExhausted":
                case "AlreadyWon":
                case "WrongGuessLength":
                case "NotYourGame":
                case "RepeatedLine":
                    // This should never happen.
                    throw result.status;
                case "NoGame":
                    return sendError(reply, "notFound", result.status);
                case "Success":
                    break;
                default:
                    throw new UnreachableCaseError(result);
            }

            return sendOk(reply, 200, result.hints);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
