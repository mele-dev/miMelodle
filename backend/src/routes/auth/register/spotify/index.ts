import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../plugins/swagger.js";
import { decorators } from "../../../../services/decorators.js";
import * as spotifyApi from "../../../../apiCodegen/spotify.js";
import {
    executeTransaction,
    runPreparedQuery,
} from "../../../../services/database.js";
import {
    addArtistToHome,
    insertUser,
} from "../../../../queries/dml.queries.js";
import { JwtTokenContent } from "../../../../types/user.js";
import {
    spotifyCallback,
    spotifyCallbackGuard,
} from "../../../../types/user.js";
import { frontendPaths } from "../../../../services/urls.js";
import { basePoints } from "../../../../services/score.js";

export default (async (fastify) => {
    fastify.get("/callback", {
        onRequest: [decorators.noSecurity],
        schema: {
            response: {
                302: SafeType.Any(),
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

            const userInfoPromise = spotifyApi.getCurrentUsersProfile({
                headers: {
                    Authorization: "Bearer " + spotifyToken.token.access_token,
                },
            });

            const userFollowsPromise = spotifyApi.getFollowed(
                { type: "artist", limit: 50 },
                {
                    headers: {
                        Authorization:
                            "Bearer " + spotifyToken.token.access_token,
                    },
                }
            );

            const userInfo = await userInfoPromise;

            const userFollows = await userFollowsPromise;

            const parsedUserInfo = spotifyCallbackGuard.Decode({
                email: userInfo.email,
                username: userInfo.display_name,
                spotifyId: userInfo.id,
            } satisfies Partial<spotifyCallback>);

            let result = await executeTransaction(async () => {
                const result = await runPreparedQuery(insertUser, {
                    ...parsedUserInfo,
                    name: parsedUserInfo.username,
                    baseGuessSongScore: basePoints,
                    baseGuessLineScore: basePoints,
                    artists:
                        userFollows?.artists?.items
                            ?.map((a) => a.id)
                            ?.filter((s) => s !== undefined) ?? [],
                });

                return result;
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
