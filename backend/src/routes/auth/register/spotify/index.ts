import {
    FastifyPluginAsyncTypebox,
    Static,
} from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../plugins/swagger.js";
import { decorators } from "../../../../services/decorators.js";
import * as spotifyApi from "../../../../apiCodegen/spotify.js";
import { runPreparedQuery } from "../../../../services/database.js";
import { insertUserSpotify } from "../../../../queries/dml.queries.js";
import {
    JwtTokenContent,
    jwtTokenSchema,
    userSchema,
} from "../../../../types/user.js";
import { sendOk } from "../../../../utils/reply.js";
import { spotifyCallbackGuard, spotifyCallbackSchema } from "../../../../types/spotify.js";

export default (async (fastify) => {
    fastify.get("/callback", {
        onRequest: [decorators.noSecurity],
        schema: {
            response: {
                201: SafeType.Object({
                    jwtToken: jwtTokenSchema.properties.jwtToken,
                    id: userSchema.properties.id,
                }),
                // TODO: Implement correct error handling.
                ...SafeType.CreateErrors([]),
            },
            summary: "Register a user through a spotify callback.",
            description:
                "The actual url you should use is this one removing /callback\n"
                + "> !) Eventually this schema will change.",
            tags: ["TODO Schema"] satisfies MelodleTagName[],
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
                // FIXME: Make orval automatically add the base url.
                baseURL: "https://api.spotify.com/v1",
            });

            const parsedUserInfo = spotifyCallbackGuard.Decode({
                email: userInfo.data.email,
                username: userInfo.data.display_name,
                spotifyId: userInfo.data.id,
            } satisfies Partial<Static<typeof spotifyCallbackSchema>>);

            // TODO: Auto-generate username so that it cannot collide.
            const result = await runPreparedQuery(insertUserSpotify, {
                ...parsedUserInfo,
                name: parsedUserInfo.username,
            });

            const token = fastify.jwt.sign({
                id: result[0].id,
            } satisfies JwtTokenContent);

            return sendOk(reply, 201, {
                jwtToken: token,
                id: result[0].id,
            });
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
