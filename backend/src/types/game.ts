import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import {
    simplifiedAlbumSchema,
    spotifyArtistSchema,
    spotifyImagesSchema,
    spotifyTrackSchema,
} from "./spotify.js";

export const commonGamePropertiesSchema = SafeType.Object({
    artistSpotifyId: SafeType.String(),
    artistsSpotifyIds: SafeType.Array(SafeType.String()),
    trackSpotifyIds: SafeType.Array(SafeType.String()),
    guessedTrackSpotifyId: SafeType.String(),
    guessedTrackName: SafeType.String(),
    guessedTrackAlbumName: SafeType.String(),
    guessedTrackAlbumImages: spotifyImagesSchema,
    artistImages: spotifyImagesSchema,
    correctTrack: spotifyTrackSchema,
});

export const guessLineHintSchema = SafeType.Object({
    snippetHint: SafeType.WithExamples(
        SafeType.String({
            description: `\
The guessed snippet, showing every spot where their characters coincide with the target snippet.
Characters which appear on the line but are on the wrong spot are marked with ~.
Characters that do not appear on the line are marked with _.
`,
        }),
        ["Dó__e está_ lo_ ladro_e_"]
    ),
    guessedLine: SafeType.String(),
});

export const guessLineGameInformationSchema = SafeType.Object({
    attempts: SafeType.Array(guessLineHintSchema),
    snippetLength: SafeType.Integer(),
    track: spotifyTrackSchema,
});

export type GuessLineGameInformation = Static<
    typeof guessLineGameInformationSchema
>;

export const guessSongHintsSchema = SafeType.Object({
    isCorrectAlbum: SafeType.Boolean(),
    isCorrectTrack: SafeType.Boolean(),
    guessedTrack: spotifyTrackSchema,
    guessedTrackNameHint: SafeType.WithExamples(
        SafeType.String({
            description:
                "The title of the guessed track, showing every spot where their characters coincide with the ones from the hidden track.",
        }),
        ["Dó__e está_ lo_ ladro_e_"]
    ),
});

export const guessSongHintsListSchema = SafeType.Array(guessSongHintsSchema, {
    description:
        "Hints for every attempt made thus far, ordered from oldest to newest.",
});

export const guessSongGameInformationSchema = SafeType.Object({
    attempts: guessSongHintsListSchema,
    artists: SafeType.Array(spotifyArtistSchema),
    snippet: SafeType.Optional(SafeType.String()),
    album: SafeType.Optional(SafeType.Partial(simplifiedAlbumSchema)),
    correctTrack: SafeType.Optional(spotifyTrackSchema),
});

export type GuessSongGameInformation = Static<
    typeof guessSongGameInformationSchema
>;

export type GuessSongHints = Static<typeof guessSongHintsSchema>;
