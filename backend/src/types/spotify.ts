import { TypeCompiler } from "@sinclair/typebox/compiler";
import { SafeType } from "../utils/typebox.js";
import { userSchema } from "./user.js";
import { Static, TArray, TSchema, TUnsafe } from "@sinclair/typebox";
import { PagingObject } from "../apiCodegen/spotify.js";

export const spotifyCallbackSchema = SafeType.Pick(userSchema, [
    "spotifyId",
    "username",
    "email",
]);

export const spotifyCallbackGuard = TypeCompiler.Compile(spotifyCallbackSchema);

export type spotifyCallback = Static<typeof spotifyCallbackSchema>;

export function createSpotifyPagination<TTSchema extends TSchema>(
    innerSchema: TTSchema
) {
    return SafeType.Object({
        limit: SafeType.Integer(),
        href: SafeType.String(),
        next: SafeType.Nullable(SafeType.String()),
        previous: SafeType.Nullable(SafeType.String()),
        total: SafeType.Integer(),
        offset: SafeType.Integer(),
        items: SafeType.Array(innerSchema),
    } satisfies { [K in keyof PagingObject]: TUnsafe<PagingObject[K]> } & {
        items: TArray<TTSchema>;
    });
}
