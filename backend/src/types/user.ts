import { Static, Type } from "@sinclair/typebox";

export const UserSchema = Type.Object(
    {
        id: Type.Number({}),
        username: Type.String({ minLength: 3, maxLength: 20 }),
        email: Type.String({
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.source,
            maxLength: 254
        }),
        password: Type.String({ minLength: 3, maxLength: 20 }),
        spotify_id: Type.Number({}),
        profile_picture_id: Type.Number({}),
        name: Type.String({ maxLength: 25 }),
    }
);

export const ErrorMessageSchema = Type.Object(
    {
        errorMessage: Type.String(),
    },
    {
        title: "An error message",
        $id: "errorMessage",
    },
);

export type UserType = Static<typeof UserSchema>;