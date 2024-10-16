export default {
    spotify: {
        input: {
            target: "https://developer.spotify.com/reference/web-api/open-api-schema.yaml",
        },
        output: {
            target: "src/apiCodegen/spotify.ts",
            prettier: true,
            baseUrl: 'https://api.spotify.com/v1',
        },
    },
    backend: {
        input: {
            target: "./schemas/backendSchema.json",
        },
        output: {
            target: "src/apiCodegen/backend.ts",
            prettier: true,
            baseUrl: "https://localhost/backend",
        },
    },
    backend_zod: {
        input: {
            target: "./schemas/backendSchema.json",
        },
        output: {
            client: 'zod',
            target: "src/apiCodegen/backend-zod.ts",
            prettier: true,
        },
    },
};
