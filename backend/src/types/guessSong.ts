import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import { ImageObject } from "../apiCodegen/spotify.js";

export const spotifyImageSchema = SafeType.Object({
    url: SafeType.String(),
    width: SafeType.Union([SafeType.Integer(), SafeType.Null()]),
    height: SafeType.Union([SafeType.Integer(), SafeType.Null()]),
} satisfies { [K in keyof ImageObject]: unknown });

export const spotifyImagesSchema = SafeType.Array(spotifyImageSchema);

export const commonGuessSongProperties = SafeType.Object({
    artistSpotifyId: SafeType.String(),
    artistsSpotifyIds: SafeType.Array(SafeType.String()),
    guessedTrackSpotifyId: SafeType.String(),
    isCorrectAlbum: SafeType.Boolean(),
    isCorrectTrack: SafeType.Boolean(),
    guessedTrackName: SafeType.String(),
    guessedTrackNameHint: SafeType.WithExamples(
        SafeType.String({
            description:
                "The title of the guessed track, showing every spot where their characters coincide with the ones from the hidden track.",
        }),
        ["Dó__e está_ lo_ ladro_e_"]
    ),
    trackSnippet: SafeType.Optional(SafeType.String()),
    guessedTrackAlbumName: SafeType.String(),
    guessedTrackAlbumImages: spotifyImagesSchema,
    artistImages: spotifyImageSchema,
});

export const guessSongHints = SafeType.Pick(commonGuessSongProperties, [
    "trackSnippet",
    "isCorrectAlbum",
    "isCorrectTrack",
    "guessedTrackNameHint",
    "guessedTrackSpotifyId",
    "guessedTrackName",
    "guessedTrackAlbumName",
    "guessedTrackAlbumImages",
]);

export const guessSongHintsList = SafeType.Array(guessSongHints, {
    description:
        "Hints for every attempt made thus far, ordered from oldest to newest.",
});

export const guessSongGameInformation = SafeType.Object({
    attempts: guessSongHintsList,
    artistId: SafeType.String(),
})

export type GuessSongHints = Static<typeof guessSongHints>;
