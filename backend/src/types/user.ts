import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";

export const UserSchema = SafeType.Object(
    {
        id: SafeType.Number({}),
        username: SafeType.String({ minLength: 3, maxLength: 20 }),
        email: SafeType.String({
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.source,
            maxLength: 254
        }),
        password: SafeType.String({ minLength: 3, maxLength: 20 }),
        spotify_id: SafeType.Number({}),
        profile_picture_id: SafeType.Number({}),
        name: SafeType.String({ maxLength: 25 }),
    },
    {
        $id: "UserSchema",
        title: "userSchema"
    }
);

export const ErrorMessageSchema = SafeType.Object(
    {
        errorMessage: SafeType.String(),
    },
    {
        title: "An error message",
        $id: "errorMessage",
    },
);

export type MelodleUserType = Static<typeof UserSchema>;
