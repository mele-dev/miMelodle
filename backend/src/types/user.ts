import { Static, Type } from "@sinclair/typebox";

export const UserSchema = Type.Object({
    id: Type.Number({ minimum: 1 }),
    name: Type.String({ minLength: 3, maxLength: 20 }),
    username: Type.String({ minLength: 4, maxLength: 20 })
});