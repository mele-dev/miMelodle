import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { decorators } from "../../../../../../../services/decorators.js";
import { ParamsSchema } from "../../../../../../../types/params.js";
import { SafeType } from "../../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../../plugins/swagger.js";
import { sendError, sendOk } from "../../../../../../../utils/reply.js";
import { guessSongGameInformationSchema } from "../../../../../../../types/guessSong.js";
import { getGuessSongInformation } from "../../../../../../../services/game.js";
import { UnreachableCaseError } from "ts-essentials";

export default (async (fastify) => {
    fastify.get("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, ["selfId", "gameId"]),
            response: {
                200: guessSongGameInformationSchema,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary: "Get information about a melodle game.",
            description: undefined,
            tags: ["User", "Melodle"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const result = await getGuessSongInformation(request.params);
            switch (result.status) {
                case "RepeatedTrack":
                case "AttemptsExhausted":
                case "AlreadyWon":
                    // This should never happen.
                    throw result.status;
                case "NoGame":
                    return sendError(reply, "notFound", result.status);
                case "TrackNotFound":
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
