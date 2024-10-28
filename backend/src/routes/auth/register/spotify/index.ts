import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../plugins/swagger.js";
import { decorators } from "../../../../services/decorators.js";
import * as spotifyApi from "../../../../apiCodegen/spotify.js";
import { runPreparedQuery } from "../../../../services/database.js";
import { insertUserSpotify, loginUserSpotify } from "../../../../queries/dml.queries.js";
import {
    JwtTokenContent,
} from "../../../../types/user.js";
import {
    spotifyCallback,
    spotifyCallbackGuard,
} from "../../../../types/spotify.js";
import { frontendPaths } from "../../../../services/urls.js";

export default (async (fastify) => {
    fastify.get("/callback", {
        onRequest: [decorators.noSecurity],
        schema: {
            response: {
                300: SafeType.Any(),
                // TODO: Implement correct error handling.
                ...SafeType.CreateErrors([]),
            },
            summary: "Register a user through a spotify callback.",
            description:
                "The actual url you should use is this one removing /callback\n" +
                "> !) Eventually this schema will change.",
            tags: ["TODO Schema", "Auth"] satisfies MelodleTagName[],
            security: [],
        },
        async handler(request, reply) {
            const spotifyToken =
                await fastify.oauth2SpotifyRegister.getAccessTokenFromAuthorizationCodeFlow(
                    request
                );

            const userInfo = await spotifyApi.getCurrentUsersProfile({
                headers: {
                    Authorization: "Bearer " + spotifyToken.token.access_token,
                },
            });

            const parsedUserInfo = spotifyCallbackGuard.Decode({
                email: userInfo.data.email,
                username: userInfo.data.display_name,
                spotifyId: userInfo.data.id,
            } satisfies Partial<spotifyCallback>);

            // TODO: Auto-generate username so that it cannot collide.
            const result = await runPreparedQuery(insertUserSpotify, {
                ...parsedUserInfo,
                name: parsedUserInfo.username,
            });

            const token = fastify.jwt.sign({
                id: result[0].id,
            } satisfies JwtTokenContent);

            return reply.redirect(
                frontendPaths.authCallback({
                    jwtToken: token,
                    selfId: result[0].id,
                })
            );
        },

        async errorHandler(_error, _request, reply) {
            return reply.redirect(
                `${frontendPaths.register}?${frontendPaths.generalSearchParams({ errorEnum: "spotify_taken" })}`
            );
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
