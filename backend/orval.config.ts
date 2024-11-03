import { defineConfig } from "orval";

export default defineConfig({
    spotify: {
        input: {
            target: "https://developer.spotify.com/reference/web-api/open-api-schema.yaml",
        },
        output: {
            target: "src/apiCodegen/spotify.ts",
            prettier: true,
            "override": {
                "mutator": {
                    "path": "./src/spotify/spotify-mutator.ts",
                    "name": "customInstance",
                },
                "useTypeOverInterfaces": true,
            }
        },
    },
});
