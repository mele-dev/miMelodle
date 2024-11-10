import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import {
    simplifiedAlbumSchema,
    spotifyArtistSchema,
    spotifyImagesSchema,
} from "./spotify.js";

export const commonGuessSongPropertiesSchema = SafeType.Object({
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
    artistImages: spotifyImagesSchema,
});

export const guessSongHintsSchema = SafeType.Pick(
    commonGuessSongPropertiesSchema,
    [
        "trackSnippet",
        "isCorrectAlbum",
        "isCorrectTrack",
        "guessedTrackNameHint",
        "guessedTrackSpotifyId",
        "guessedTrackName",
        "guessedTrackAlbumName",
        "guessedTrackAlbumImages",
    ]
);

export const guessSongHintsListSchema = SafeType.Array(guessSongHintsSchema, {
    description:
        "Hints for every attempt made thus far, ordered from oldest to newest.",
});
export const guessSongGameInformationSchema = SafeType.Object({
    attempts: guessSongHintsListSchema,
    artists: SafeType.Array(spotifyArtistSchema),
    snippet: SafeType.Optional(SafeType.String()),
    album: SafeType.Optional(SafeType.Partial(simplifiedAlbumSchema)),
});

export type GuessSongGameInformation = Static<
    typeof guessSongGameInformationSchema
>;

export type GuessSongHints = Static<typeof guessSongHintsSchema>;
