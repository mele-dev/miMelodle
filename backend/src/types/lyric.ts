import { SafeType } from "../utils/typebox.js";

export const lyricSchema = SafeType.Object(
    {
        lyricsId: SafeType.String({
            description: "Identifier for the lyrics provided by MusixMatch.",
        }),
        trackId: SafeType.String({
            description:
                "Identifier for the track associated with these lyrics on MusixMatch.",
        }),
        lyricsBody: SafeType.String({
            description: "The full lyrics of the track.",
        }),
        explicit: SafeType.Boolean({
            description: "Indicates if the lyrics contain explicit content.",
        }),
        language: SafeType.String({
            description: "The language in which the lyrics are written.",
        }),
        copyright: SafeType.Optional(
            SafeType.String({
                description:
                    "Copyright information for the lyrics, if available.",
            })
        ),
    },
    {
        $id: "LyricSchema",
        title: "lyricSchema",
    }
);
