import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import { profilePictureSchema } from "./public.js";
import { artistSchema } from "./artist.js";

export const userSchema = SafeType.Object(
    {
        id: SafeType.Integer({
            description:
                "A numeric identifier for a user. Generated by the backend, " +
                "unique and unchangeable.",
        }),
        username: SafeType.String({
            pattern: /^[a-zA-Z0-9.-_]+$/.source,
            minLength: 3,
            maxLength: 20,
            description:
                "The id to display to users. They must be unique, but the " +
                "users can choose and change them.\n" +
                "### Rules\n" +
                "- Only accepts letters, digits and '.', '-', '_'.",
        }),
        email: SafeType.String({
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.source,
            maxLength: 254,
            description: "The user's email.",
        }),
        password: SafeType.String({
            minLength: 3,
            maxLength: 20,
            description: "A password.",
        }),
        spotifyId: SafeType.String({
            description:
                "The user's id to use to connect with spotify services. " +
                "It is not stored within the database, but some requests " +
                "need it to function.",
        }),
        profilePictureId: SafeType.Integer({
            description:
                "The id to the profile picture of the user. " +
                "These pictures cannot be uploaded, we store the " +
                "options manually.",
        }),
        favoriteArtists: SafeType.Array(artistSchema, {
            description:
                "An array of every artist currently favorited by the user.",
        }),
        profilePictureFilename: profilePictureSchema.properties.filename,
        name: SafeType.String({
            minLength: 1,
            maxLength: 25,
            description:
                "The user's display name. It does not need to be unique.",
        }),
    },
    {
        $id: "UserSchema",
        title: "userSchema",
    }
);

// I do this because I can't use SafeType.WithExamples, since WithExamples
// depends on the this schema.
const jwtTokenSchemaSchematic = SafeType.Object({
    jwtToken: SafeType.String({
        description:
            "The 'encrypted' jwt token. It is easily decryptable, " +
            "so no sensitive information is stored there.",
    }),
});

export const jwtTokenSchema = SafeType.Object(
    jwtTokenSchemaSchematic.properties,
    {
        description: "A token which will serve to authenticate a user.",
        examples: [
            {
                jwtToken:
                    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwiaWF0IjoxNzI3NDExODc4fQ.lCYmZF_REl8rYYj1UjJzacXrPCTyjVdA-KsR71xHwQw",
            },
        ] satisfies Static<typeof jwtTokenSchemaSchematic>[],
        $id: "jwtToken",
    }
);

export const friendSchema = SafeType.Object({
    username: userSchema.properties.username,
    status: SafeType.StringEnum(["pending", "blocked", "accepted"]),
});

export const selfIdSchema = SafeType.Object({
    selfId: userSchema.properties.id,
});

export const friendRelationShipSchema = SafeType.Object({
    ...selfIdSchema.properties,
    friendId: userSchema.properties.id,
});

/** Use this schema to assert the contents of the jwt token. */
export const jwtTokenContentSchema = SafeType.Pick(userSchema, ["id"]);

export type JwtTokenContent = Static<typeof jwtTokenContentSchema>;
export type jwtTokenReturn = Static<typeof jwtTokenSchema>;

export type User = Static<typeof userSchema>;

export type FriendType = Static<typeof friendSchema>;
