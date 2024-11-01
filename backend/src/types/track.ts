import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";

export const trackSchema = SafeType.Object(
    {
        trackId: SafeType.Integer({
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

export const musixMatchTrackSchema = SafeType.Object({
    track: SafeType.Object({
        track_id: SafeType.Number(),
        track_name: SafeType.String(),
        track_name_translation_list: SafeType.Array(SafeType.Any()),
        track_rating: SafeType.Number(),
        commontrack_id: SafeType.Number(),
        instrumental: SafeType.Number(),
        explicit: SafeType.Number(),
        has_lyrics: SafeType.Number(),
        has_subtitles: SafeType.Number(),
        has_richsync: SafeType.Number(),
        num_favourite: SafeType.Number(),
        album_id: SafeType.Number(),
        album_name: SafeType.String(),
        artist_id: SafeType.Number(),
        artist_name: SafeType.String(),
        track_share_url: SafeType.String(),
        track_edit_url: SafeType.String(),
        restricted: SafeType.Number(),
        updated_time: SafeType.String({ format: "date-time" }),
        primary_genres: SafeType.Object({
            music_genre_list: SafeType.Array(
                SafeType.Object({
                    music_genre: SafeType.Object({
                        music_genre_id: SafeType.Number(),
                        music_genre_parent_id: SafeType.Number(),
                        music_genre_name: SafeType.String(),
                        music_genre_name_extended: SafeType.String(),
                        music_genre_vanity: SafeType.String(),
                    }),
                })
            ),
        }),
    }),
});

export const musixMatchTrackListSchema = SafeType.Object({
    track_list: SafeType.Array(musixMatchTrackSchema),
});

export type MusixMatchTrack = Static<typeof musixMatchTrackSchema>;
export type MusixMatchTrackList = Static<typeof musixMatchTrackListSchema>;
