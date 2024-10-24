export default {
    spotify: {
        input: {
            target: "https://developer.spotify.com/reference/web-api/open-api-schema.yaml",
        },
        output: {
            target: "src/apiCodegen/spotify.ts",
            prettier: true,
            baseUrl: "https://api.spotify.com/v1",
        },
    },
    musixmatch: {
        input: {
            target: "./src/utils/musixmatch/musimusixmatch-openapi.yaml",
        },
        output: {
            target: "./src/api/musixmatch.ts",
            prettier: true,
            baseUrl: "https://api.musixmatch.com/ws/1.1",
        },
    },
};