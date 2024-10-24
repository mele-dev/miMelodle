import { SafeType } from "../utils/typebox.js";

export const trackSchema = SafeType.Object(
    {
        trackId: SafeType.String({
            description: "Identifier for the track provided by MusixMatch.",
        }),
        trackName: SafeType.String({
            description: "The name of the track.",
        }),
        artistName: SafeType.String({
            description: "The name of the artist associated with the track.",
        }),
        albumName: SafeType.String({
            description: "The name of the album that contains the track.",
        }),
        releaseDate: SafeType.Optional(
            SafeType.String({
                description:
                    "The release date of the track, formatted as 'YYYY-MM-DD'.",
            })
        ),
        duration: SafeType.Optional(
            SafeType.Integer({
                description: "Duration of the track in milliseconds.",
            })
        ),
        explicit: SafeType.Boolean({
            description: "Indicates if the track contains explicit content.",
        }),
        genre: SafeType.Optional(
            SafeType.String({
                description: "The genre of the track, if available.",
            })
        ),
        coverUrl: SafeType.Optional(
            SafeType.String({
                description:
                    "URL to download the cover image of the album or track, if available.",
            })
        ),
    },
    {
        $id: "TrackSchema",
        title: "trackSchema",
    }
);
