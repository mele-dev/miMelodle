import {
    FastifyPluginAsyncTypebox,
    Static,
} from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../plugins/swagger.js";
import { decorators } from "../../../../services/decorators.js";
import * as spotifyApi from "../../../../apiCodegen/spotify.js";
import {
    spotifyCallback,
    spotifyCallbackGuard,
    spotifyCallbackSchema,
} from "../../../../types/spotify.js";
import { runPreparedQuery } from "../../../../services/database.js";
import { loginUserSpotify } from "../../../../queries/dml.queries.js";
import {
    JwtTokenContent,
    jwtTokenSchema,
    userSchema,
} from "../../../../types/user.js";
import { sendOk } from "../../../../utils/reply.js";
import { SafeType } from "../../../../utils/typebox.js";

export default (async (fastify) => {
    fastify.get("/callback", {
        onRequest: [decorators.noSecurity],
        schema: {
            response: {
                200: SafeType.Object({
                    jwtToken: jwtTokenSchema.properties.jwtToken,
                    id: userSchema.properties.id,
                }),
                // TODO: Implement correct error handling.
                ...SafeType.CreateErrors([]),
            },
            security: [],
            summary: "Login through spotify.",
            tags: ["Auth", "TODO Schema"] satisfies MelodleTagName[],
        },
        async handler(request, reply) {
            const spotifyToken =
                await fastify.oauth2SpotifyLogin.getAccessTokenFromAuthorizationCodeFlow(
                    request
                );

            const userInfo = await spotifyApi.getCurrentUsersProfile({
                headers: {
                    Authorization: "Bearer " + spotifyToken.token.access_token,
                },
            });

            const parsedUserInfo = spotifyCallbackGuard.Decode({
                spotifyId: userInfo.data.id,
            } satisfies Partial<spotifyCallback>);

            const result = await runPreparedQuery(
                loginUserSpotify,
                parsedUserInfo
            );

            const token = fastify.jwt.sign({
                id: result[0].id,
            } satisfies JwtTokenContent);

            return sendOk(reply, 200, {
                jwtToken: token,
                id: result[0].id,
            });
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
