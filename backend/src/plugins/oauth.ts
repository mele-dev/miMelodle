import fastifyOauth2 from "@fastify/oauth2";
import fastifyPlugin from "fastify-plugin";

type SpotifyScopes =
    // Images
    | "ugc-image-upload"
    // Spotify Connect
    | "user-read-playback-state"
    | "user-modify-playback-state"
    | "user-read-currently-playing"
    // Playback
    | "app-remote-control"
    | "streaming"
    // Playlists
    | "playlist-read-private"
    | "playlist-read-collaborative"
    | "playlist-modify-private"
    | "playlist-modify-public"
    // Follow
    | "user-follow-modify"
    | "user-follow-read"
    // Listening History
    | "user-read-playback-position"
    | "user-top-read"
    | "user-read-recently-played"
    // Library
    | "user-library-modify"
    | "user-library-read"
    // Users
    | "user-read-email"
    | "user-read-private"
    // Open Access
    | "user-soa-link"
    | "user-soa-unlink"
    | "soa-manage-entitlements"
    | "soa-manage-partner"
    | "soa-create-partner";

export default fastifyPlugin(async (fastify) => {
    fastify.register(fastifyOauth2, {
        name: "spotifyRegister",
        scope: [
            "user-read-email",
            "user-library-read",
            "user-follow-read"
        ] satisfies SpotifyScopes[],
        pkce: "S256",
        credentials: {
            client: {
                // FIXME: Move this info to .env
                id: "1cbcb63c89134289aac6425996162c4a",
                secret: "f2903f0fa6da4e17b8bb324b86b12940",
            },
            auth: fastifyOauth2.fastifyOauth2.SPOTIFY_CONFIGURATION,
        },
        startRedirectPath: "/auth/register/spotify",
        callbackUri: "https://localhost/backend/auth/register/spotify/callback",
    });

    fastify.register(fastifyOauth2, {
        name: "spotifyLogin",
        scope: [
            "user-read-email",
            "user-library-read",
            "user-follow-read"
        ] satisfies SpotifyScopes[],
        pkce: "S256",
        credentials: {
            client: {
                // FIXME: Move this info to .env
                id: "1cbcb63c89134289aac6425996162c4a",
                secret: "f2903f0fa6da4e17b8bb324b86b12940",
            },
            auth: fastifyOauth2.fastifyOauth2.SPOTIFY_CONFIGURATION,
        },
        startRedirectPath: "/auth/login/spotify",
        callbackUri: "https://localhost/backend/auth/login/spotify/callback",
    });
});
