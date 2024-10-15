import { OAuth2Namespace } from '@fastify/oauth2';

declare module 'fastify' {
    interface FastifyInstance{
        googleOAuth2: OAuth2Namespace;
        oauth2SpotifyRegister: OAuth2Namespace;
        oauth2SpotifyLogin: OAuth2Namespace;
    }
}
