import { SafeType } from "../utils/typebox.js";

export const commonGuessLineProperties = SafeType.Object({
    artistSpotifyId: SafeType.String(),
    artistsSpotifyIds: SafeType.Array(SafeType.String()),
    guessedTrackSpotifyId: SafeType.String(),
    isCorrectAlbum: SafeType.Boolean(),
    isCorrectTrack: SafeType.Boolean(),
    guessedTrackTitleHint: SafeType.WithExamples(
        SafeType.String({
            description:
                "The title of the guessed track, showing every spot where their characters coincide with the ones from the hidden track.",
        }),
        ["Dó__e está_ lo_ ladro_e_"]
    ),
    trackSnippet: SafeType.Optional(SafeType.String()),
});
