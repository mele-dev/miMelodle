import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import {
    artistSchema,
    simplifiedAlbumSchema,
    spotifyArtistSchema,
    spotifyImagesSchema,
    spotifyTrackSchema,
} from "./spotify.js";

export const commonGuessSongPropertiesSchema = SafeType.Object({
    artistSpotifyId: SafeType.String(),
    artistsSpotifyIds: SafeType.Array(SafeType.String()),
    guessedTrackSpotifyId: SafeType.String(),
    guessedTrackName: SafeType.String(),
    guessedTrackAlbumName: SafeType.String(),
    guessedTrackAlbumImages: spotifyImagesSchema,
    artistImages: spotifyImagesSchema,
    correctTrack: spotifyTrackSchema,
});

export const guessSongHintsSchema =  SafeType.Object({
    isCorrectAlbum: SafeType.Boolean(),
    isCorrectTrack: SafeType.Boolean(),
    guessedTrack: spotifyTrackSchema,
    guessedTrackNameHint: SafeType.WithExamples(
        SafeType.String({
            description:
                "The title of the guessed track, showing every spot where their characters coincide with the ones from the hidden track.",
        }),
        ["Dó__e está_ lo_ ladro_e_"]
    )
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
    correctTrack: SafeType.Optional(spotifyTrackSchema)
});

export type GuessSongGameInformation = Static<
    typeof guessSongGameInformationSchema
>;

export type GuessSongHints = Static<typeof guessSongHintsSchema>;
