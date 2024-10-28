import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { MelodleTagName } from "../../../../plugins/swagger.js";
import { decorators } from "../../../../services/decorators.js";
import * as spotifyApi from "../../../../apiCodegen/spotify.js";
import {
    spotifyCallback,
    spotifyCallbackGuard,
} from "../../../../types/spotify.js";
import { runPreparedQuery } from "../../../../services/database.js";
import { loginUserSpotify } from "../../../../queries/dml.queries.js";
import { JwtTokenContent } from "../../../../types/user.js";
import { SafeType } from "../../../../utils/typebox.js";
import { frontendPaths } from "../../../../services/urls.js";

export default (async (fastify) => {
    fastify.get("/callback", {
        onRequest: [decorators.noSecurity],
        schema: {
            response: {
                // TODO: Ask about redirect schema.
                300: SafeType.Any(),
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
                email: userInfo.data.email,
                username: userInfo.data.display_name,
            } satisfies Partial<spotifyCallback>);

            const result = await runPreparedQuery(
                loginUserSpotify,
                parsedUserInfo
            );

            const token = fastify.jwt.sign({
                id: result[0].id,
            } satisfies JwtTokenContent);

            return reply.redirect(
                frontendPaths.authCallback({
                    selfId: result[0].id,
                    jwtToken: token,
                })
            );
        },
        async errorHandler(_error, _request, reply) {
            return reply.redirect(
                `${frontendPaths.login}?${frontendPaths.generalSearchParams({ errorEnum: "no_user_spotify" })}`
            );
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
