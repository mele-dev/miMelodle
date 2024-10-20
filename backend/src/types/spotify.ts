import { TypeCompiler } from "@sinclair/typebox/compiler";
import { SafeType } from "../utils/typebox.js";
import { userSchema } from "./user.js";

export const spotifyCallbackSchema = SafeType.Pick(userSchema, [
    "spotifyId",
    "username",
    "email",
]);
export const spotifyCallbackGuard = TypeCompiler.Compile(spotifyCallbackSchema);
