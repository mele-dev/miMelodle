import { FastifySwaggerOptions } from "@fastify/swagger";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import fp from "fastify-plugin";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import { typedEnv } from "../types/env.js";

const asciiArt = String.raw`(
 AAAAAaaaaaaaa!
              (   ()   )
    ) ________    //  )
 ()  |\       \  //
( \\__ \ ______\//
   \__) |       |
     |  |       |
      \ |       |
       \|_______|
       //    \\
      ((     ||
       \\    ||
     ( ()    ||
      (      () ) )
`;

export const tags = [
    {
        name: "TODO Schema",
        description: "Endpoints whose schema we have yet to do.",
    },
    {
        name: "User CRUD",
        description:
            "Endpoints of the user's CRUD. (This is the one we implemented.)",
    },
    {
        name: "Melodle",
        description: "Endpoints specifically to play the melodle game.",
    },
    {
        name: "Debug",
        description:
            "Endpoints only enabled on debug mode. " +
            "If you see endpoints inside here while in production " +
            "(so, if you are our client), please notify us. " +
            "That would be a security vulnerability.",
    },
    {
        name: "Auth",
        description: "Authentication-related endpoints.",
    },
    {
        name: "Static",
        description:
            "Endpoints about information that never changes through user interaction.",
    },
    {
        name: "Artists",
        description: "Endpoints about fetching information from artists.",
    },
    {
        name: "Lyrics",
        description: "Endpoints related to obtaining tracks lyrics.",
    },
    {
        name: "Friends",
        description: "Friends related endpoints.",
    },
    {
        name: "User",
        description: "Endpoints to deal with users on their own.",
    },
    {
        name: "Game configs",
        description: "Enspoints to manipulate your game configurations.",
    },
    {
        name: "Leaderboards",
        description:
            "Ranking lists showing best players depending on every gamemode.",
    },
    {
        name: "Other",
        description: "Endpoints which serve odd purposes.",
    },
    {
        name: "Blocking",
        description: "Endpoints related to blocking users.",
    },
] as const satisfies {
    name: string;
    description: string;
    externalDocs?: string;
}[];

export type MelodleTagName = (typeof tags)[number]["name"];

export default fp<FastifySwaggerOptions>(async (fastify, _opts) => {
    await fastify.register(swagger, {
        openapi: {
            openapi: "3.0.0",
            info: {
                title: "Melodle API",
                description:
                    "---\n## Documentation for Melodle's devs.\n" +
                    `\`\`\`${asciiArt}\`\`\``,
                version: "0.1.0",
            },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: "http",
                        scheme: "bearer",
                        bearerFormat: "JWT",
                    },
                },
            },

            tags,
            servers: [
                {
                    url: `https://${typedEnv.FRONT_URL}/backend`,
                    description: "Development server",
                },
            ],
            security: [{ bearerAuth: [] }],
        },
    });

    await fastify.register(swaggerUi, {
        routePrefix: "docs",
        uiConfig: {
            docExpansion: "list",
            deepLinking: true,
            filter: true,
            defaultModelExpandDepth: 10,
            defaultModelsExpandDepth: 10,
            defaultModelRendering: "example",
            syntaxHighlight: {
                theme: "arta",
            },
            showCommonExtensions: true,
            persistAuthorization: true,
            displayRequestDuration: true,
            showExtensions: true,
        },
        uiHooks: {
            onRequest: function (_request, _reply, next) {
                next();
            },
            preHandler: function (_request, _reply, next) {
                next();
            },
        },
        theme: {
            title: "Melodle API documentation",
            css: [
                {
                    filename: "theme.css",
                    content: new SwaggerTheme().getBuffer(
                        SwaggerThemeNameEnum.DARK
                    ),
                },
            ],
        },
        staticCSP: true,
        transformStaticCSP: (header) => header,
        transformSpecification: (swaggerObject, _request, _reply) => {
            return swaggerObject;
        },
        transformSpecificationClone: true,
    });
});
