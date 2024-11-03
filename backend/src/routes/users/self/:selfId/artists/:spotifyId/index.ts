import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../../../plugins/swagger.js";
import { ParamsSchema } from "../../../../../../types/params.js";
import { decorators } from "../../../../../../services/decorators.js";
import { artistSchema } from "../../../../../../types/artist.js";
import { runPreparedQuery } from "../../../../../../services/database.js";
import { sendError, sendOk } from "../../../../../../utils/reply.js";
import { addArtist } from "../../../../../../queries/dml.queries.js";

export default (async (fastify) => {
    const isFavoriteSchema = SafeType.Object({
        isFavorite: SafeType.Boolean(),
    });

    fastify.put("/favorite", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, [
                "selfId",
                "spotifyId",
            ]),
            body: isFavoriteSchema,
            response: {
                200: isFavoriteSchema,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary:
                "Update whether a given artist is within you favorite ones.",
            description: undefined,
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async handler(_request, reply) {
            return reply.notImplemented();
        },
    });

    fastify.post("", {
        onRequest: [decorators.authenticateSelf()],
        schema: {
            params: SafeType.Pick(ParamsSchema, [
                "selfId",
                "spotifyId",
            ]),
            response: {
                200: SafeType.Boolean()/* artistSchema */,
                ...SafeType.CreateErrors(["unauthorized", "notFound"]),
            },
            summary:
                "Add an artist to user's home (for not Spotify users mostly).",
            description: undefined,
            tags: ["Artists"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const queryResult = await runPreparedQuery(addArtist, request.params);
            //const artistId = queryResult[0].artistId
            //const response = await runPreparedQuery(getArtist, artistId)
            switch (queryResult.length) {
                case 0:
                    return sendError(
                        reply,
                        "notFound",
                        "Could not find artist with such an id."
                    );
                case 1:
                    return sendOk(reply, 200, true);
                default:
                    throw "Something went wrong";
            }
        },
    })

}) satisfies FastifyPluginAsyncTypebox;
