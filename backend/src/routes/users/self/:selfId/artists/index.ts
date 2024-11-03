import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../../plugins/swagger.js";
import { SafeType } from "../../../../../utils/typebox.js";
import {
    friendSchema,
    selfIdSchema,
    userSchema,
} from "../../../../../types/user.js";
import { decorators } from "../../../../../services/decorators.js";
import { sendOk } from "../../../../../utils/reply.js";
import { runPreparedQuery } from "../../../../../services/database.js";
import {
    getBlockedUsers,
    getHomeArtists,
    getSelfFriends,
} from "../../../../../queries/dml.queries.js";
import { artistSchema } from "../../../../../types/artist.js";
import { getAnArtist } from "../../../../../apiCodegen/spotify.js";

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
                        ...SafeType.Pick(artistSchema, [
                            "id",
                            "spotifyId",
                            "name",
                            "imageUrl"
                        ]).properties,
                    })
                ),
                ...SafeType.CreateErrors(["unauthorized"]),
            },
        },
        async handler(request, reply) {
            const queryResult = await runPreparedQuery(
                getHomeArtists,
                request.params
            );

            queryResult.forEach(async (artist) => {
                await runPreparedQuery (getAnArtist)
            }) 
            return sendOk(reply, 200, queryResult);
        },
    });
}) satisfies FastifyPluginAsyncTypebox;


