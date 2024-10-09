import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { SafeType } from "../../../../utils/typebox.js";
import { MelodleTagName } from "../../../../plugins/swagger.js";
import { decorators } from "../../../../services/decorators.js";

export default (async (fastify) => {
    fastify.get("/callback", {
        onRequest: [decorators.noSecurity],
        schema: {
            response: {
                200: SafeType.Any(),
                ...SafeType.CreateErrors([]),
            },
            summary: "TODO!",
            description: undefined,
            tags: ["TODO Schema"] satisfies MelodleTagName[],
            security: [],
        },
        async handler(request, reply) {
            const token =
                await fastify.oauth2SpotifyRegister.getAccessTokenFromAuthorizationCodeFlow(
                    request
                );

            return token;
        },
    });
}) satisfies FastifyPluginAsyncTypebox;
