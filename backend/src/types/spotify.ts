import { TypeCompiler } from "@sinclair/typebox/compiler";
import { SafeType } from "../utils/typebox.js";
import { userSchema } from "./user.js";
import { Static } from "@sinclair/typebox";

export const spotifyCallbackSchema = SafeType.Pick(userSchema, [
    "spotifyId",
    "username",
    "email",
]);

export const spotifyCallbackGuard = TypeCompiler.Compile(spotifyCallbackSchema);

export type spotifyCallback = Static<typeof spotifyCallbackSchema>;
