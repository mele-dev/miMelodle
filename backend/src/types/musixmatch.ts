import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";

export function createMusixMatchBooleanSchema(description?: string) {
    return SafeType.Optional(
        SafeType.Integer({ minimum: 0, maximum: 1, description })
    );
}

function createMusixMatchSortingSchema(descriptionPrefix?: string) {
    return SafeType.StringEnum(["ASC", "DESC"], {
        description: `${descriptionPrefix}, possible values are \`ASD | DESC\``,
    });
}

export const musixMatchQueryParamsSchema = SafeType.Object({
    // Ids
    track_id: SafeType.Integer({
        description: "Musixmatch track id.",
    }),
    artist_id: SafeType.Integer({
        description: "Musixmatch artist id.",
    }),
    album_id: SafeType.Integer({
        description: "Musixmatch album id.",
    }),
    commontrack_id: SafeType.Integer({
        description: "Musixmatch commontrack id.",
    }),

    // Querying
    q_track: SafeType.String({
        description: "Search for a text string among song titles.",
    }),
    q_artist: SafeType.String({
        description: "Search for a text string among artist names.",
    }),
    q_track_artist: SafeType.String({
        description: "Search for any word in the song title or artist name.",
    }),
    q_writer: SafeType.String({
        description: "Search among writers.",
    }),
    q_lyrics: SafeType.String({
        description: "Search for a text string among lyrics.",
    }),
    q_album: SafeType.String({
        description: "Search for a text string among albums.",
    }),
    q: SafeType.String({
        description:
            "Search for a text string among song titles, artist names and lyrics.",
    }),

    // Filtering
    f_has_lyrics: createMusixMatchBooleanSchema(
        "Filter by objects with available lyrics."
    ),
    f_is_instrumental: createMusixMatchBooleanSchema(
        "Filter instrumental songs."
    ),
    f_has_subtitle: createMusixMatchBooleanSchema(
        "Filter by objects with a specific music category."
    ),
    f_music_genre_id: SafeType.Integer({
        description: "Filter by objects with a specific music category.",
    }),
    f_subtitle_length: SafeType.Integer({
        description: "Filter subtitles by a given duration in seconds.",
    }),
    f_subtitle_length_max_deviation: SafeType.Integer({
        description:
            "Apply a deviation to a given subtitle duration (in seconds.)",
    }),
    f_richsync_length: SafeType.Integer({
        description: "The desired length of the sync (seconds)",
    }),
    f_richsync_length_max_deviation: SafeType.Integer({
        description: "The maximum deviation allowed from the f_sync_length.",
    }),
    f_lyrics_language: SafeType.String({
        minLength: 2,
        maxLength: 2,
        description: "Filter the tracks by lyrics language.",
    }),
    f_artist_id: SafeType.Integer({
        description: "Filter by objects with a given Musixmatch artist_id.",
    }),
    f_track_release_group_first_release_date_min: SafeType.String({
        minLength: 8,
        maxLength: 8,
        description:
            "When set, filter the tracks with release date newer than value, format is YYYYMMDD",
    }),
    f_track_release_group_first_release_date_max: SafeType.String({
        minLength: 8,
        maxLength: 8,
        description:
            "When set, filter the tracks with release date older than value, format is YYYYMMDD",
    }),

    // Grouping
    g_commontrack: SafeType.Integer({
        description: "Group a track result set by commontrack_id.",
    }),
    g_album_name: createMusixMatchBooleanSchema("Group by Album Name."),

    // Sorting
    s_track_rating: createMusixMatchSortingSchema(
        "Sort the results by musixmatch index for tracks"
    ),
    s_track_release_date: createMusixMatchSortingSchema(
        "Sort the results by release date"
    ),
    s_artist_rating: createMusixMatchSortingSchema(
        "Sort the results by musixmatch popularity index for artists"
    ),
    s_release_date: createMusixMatchSortingSchema(
        "Sort by release date (asc|desc)"
    ),

    // Result set pagination
    page: SafeType.Integer({
        description: "Request specific result page (default=1)",
    }),
    page_size: SafeType.Integer({
        description:
            "Specify number of items per result page (default=10, range is 1 to 100).",
    }),

    // Output format
    subtitle_format: SafeType.StringEnum(["LRC", "DFXP", "STLEDU"], {
        description:
            "Desired output format for the subtitle body. " +
            "Possible values `LRC | DFXP | STLEDU`." +
            "Default to `LRC`.",
    }),

    // Localization
    country: SafeType.String({
        minLength: 2,
        maxLength: 2,
        description: "The country code of the desired country.",
    }),

    // Route-specific
    chart_name: SafeType.StringEnum(
        ["top", "hot", "mxmweekly", "mxmweekly_new"],
        {
            description: `
Choose from available chart types:

    - top: Editorial chart for curated content.
    - hot: Most-viewed lyrics in the past 2 hours.
    - mxmweekly: Tracks with the highest lyric views in the past 7 days.
    - mxmweekly_new: Most-viewed lyrics for new releases in the past 7 days only.
`,
        }
    ),
    track_isrc: SafeType.String({
        description:
            "If you have an available isrc in your catalogue you can query using this id only.",
    }),
    quorum_factor: SafeType.Number({
        minimum: 0.1,
        maximum: 0.9,
        description:
            "Search for only a part of the given query string. Allowed range is (0.1 - 0.9)",
    }),
    selected_language: SafeType.String({
        minLength: 2,
        maxLength: 2,
        description: "The language of the translated lyrics (ISO 639-1).",
    }),
    min_completed: SafeType.Number({
        minimum: 0,
        maximum: 1,
        description:
            "Teal from 0 to 1. If present, only the tracks with a translation " +
            "ratio over this specific value, for a given language, are returned. " +
            "Set it to 1 for completed translation only, to 0.7 for a miminum " +
            "of 70% complete translation.",
    }),
});

export type MusixMatchQueryParams = Static<typeof musixMatchQueryParamsSchema>;

export type PickMusixMatchQueryParams<
    TRequiredPropertyKeys extends
        | keyof MusixMatchQueryParams
        | undefined = undefined,
    TOptionalPropertyKeys extends
        | keyof MusixMatchQueryParams
        | undefined = undefined,
> = { [K in TRequiredPropertyKeys & string]-?: MusixMatchQueryParams[K] } & {
    [K in TOptionalPropertyKeys & string]?: MusixMatchQueryParams[K];
};

export const commonMusixMatchResponseProperties = SafeType.Object({
    script_tracking_url: SafeType.String(),
    pixel_tracking_url: SafeType.String(),
    html_tracking_url: SafeType.Optional(SafeType.String()),
    updated_time: SafeType.String({ format: "date-time" }),
    restricted: createMusixMatchBooleanSchema(),
    instrumental: createMusixMatchBooleanSchema(),
    explicit: createMusixMatchBooleanSchema(),
    writer_list: SafeType.Optional(SafeType.Unknown()),
    publisher_list: SafeType.Optional(SafeType.Unknown()),
    lyrics_id: SafeType.Optional(SafeType.Number()),
    lyrics_body: SafeType.String(),
    lyrics_copyright: SafeType.String(),
    lyrics_language: SafeType.Optional(SafeType.String()),
    lyrics_language_description: SafeType.Optional(SafeType.String()),
    backlink_url: SafeType.Optional(SafeType.String()),
    can_edit: createMusixMatchBooleanSchema(),
    check_validation_overrideable: createMusixMatchBooleanSchema(),
    locked: createMusixMatchBooleanSchema(),
    action_requested: SafeType.Optional(SafeType.String()),
    verified: createMusixMatchBooleanSchema(),
    snippet_id: SafeType.Integer(),
    snippet_language: SafeType.String(),
    snippet_body: SafeType.String(),
    subtitle_id: SafeType.Optional(SafeType.Integer()),
    published_status: createMusixMatchBooleanSchema(),
    subtitle_body: SafeType.String(),
    subtitle_avg_count: SafeType.Integer(),
    subtitle_length: SafeType.Integer(),
    subtitle_language_description: SafeType.String(),
    richsync_id: SafeType.Integer(),
    richsync_body: SafeType.String(),
    richsync_length: SafeType.Integer(),
    richsync_language: SafeType.String(),
    richsync_language_description: SafeType.String(),
    richsync_avg_count: SafeType.Integer(),
    selected_language: SafeType.String({
        minLength: 2,
        maxLength: 2,
        description: "The language of the translated lyrics (ISO 639-1).",
    }),
    artist_id: SafeType.Integer(),
    artist_fq_id: SafeType.Optional(SafeType.String()),
    artist_mbid: SafeType.Optional(SafeType.String()),
    artist_name: SafeType.String(),
    artist_name_translation_list: SafeType.Unknown(),
    artist_comment: SafeType.String(),
    artist_country: SafeType.String(),
    artist_alias_list: SafeType.Array(
        SafeType.Object({ artist_alias: SafeType.String() })
    ),
    artist_rating: SafeType.Integer(),
    artist_twitter_url: SafeType.Optional(SafeType.String()),
    artist_website_url: SafeType.Optional(SafeType.String()),
    artist_instagram_url: SafeType.Optional(SafeType.String()),
    artist_tiktok_url: SafeType.Optional(SafeType.String()),
    artist_facebook_url: SafeType.Optional(SafeType.String()),
    artist_youtube_url: SafeType.Optional(SafeType.String()),
    artist_vanity_url: SafeType.Optional(SafeType.String()),
    artist_edit_url: SafeType.Optional(SafeType.String()),
    artist_share_url: SafeType.Optional(SafeType.String()),
    externals_ids: SafeType.Optional(
        SafeType.Partial(
            SafeType.Object(
                {
                    spotify: SafeType.Array(SafeType.String()),
                    itunes: SafeType.Array(SafeType.String()),
                    amazon_music: SafeType.Array(SafeType.String()),
                },
                { additionalProperties: true }
            )
        )
    ),
    begin_date_year: SafeType.String(),
    begin_date: SafeType.String(),
    end_date_year: SafeType.String(),
    end_date: SafeType.String(),
    music_genre: SafeType.Object({
        music_genre_id: SafeType.Integer(),
        music_genre_parent_id: SafeType.Integer(),
        music_genre_name: SafeType.String(),
        music_genre_name_extended: SafeType.String(),
        music_genre_vanity: SafeType.Nullable(SafeType.String()),
    }),
    managed: createMusixMatchBooleanSchema(),
    album_id: SafeType.Integer(),
    album_mbid: SafeType.String(),
    album_name: SafeType.String(),
    album_rating: SafeType.Integer(),
    album_track_count: SafeType.Optional(SafeType.Integer()),
    album_release_date: SafeType.String(),
    album_release_type: SafeType.Optional(SafeType.String()),
    album_pline: SafeType.String(),
    album_copyright: SafeType.String(),
    album_label: SafeType.String(),
    album_vanity_id: SafeType.Optional(SafeType.String()),
    album_edit_url: SafeType.Optional(SafeType.String()),
    album_coverart_100x100: SafeType.Optional(SafeType.String()),
    album_coverart_350x350: SafeType.Optional(SafeType.String()),
    album_coverart_500x500: SafeType.Optional(SafeType.String()),
    album_coverart_800x800: SafeType.Optional(SafeType.String()),
    track_id: SafeType.Integer(),
    track_mbid: SafeType.Optional(SafeType.Integer()),
    track_isrc: SafeType.Optional(SafeType.String()),
    commontrack_isrcs: SafeType.Optional(
        SafeType.Array(SafeType.Array(SafeType.String()))
    ),
    track_spotify_id: SafeType.Optional(SafeType.String()),
    commontrack_spotify_ids: SafeType.Optional(
        SafeType.Array(SafeType.String())
    ),
    commontrack_itunes_ids: SafeType.Optional(
        SafeType.Array(SafeType.String())
    ),
    track_soundcloud_id: SafeType.Optional(SafeType.String()),
    track_xboxmusic_id: SafeType.Optional(SafeType.String()),
    track_name: SafeType.String(),
    track_name_translation_list: SafeType.Unknown(),
    track_rating: SafeType.Integer(),
    track_length: SafeType.Optional(SafeType.Integer()),
    commontrack_id: SafeType.Integer(),
    has_lyrics: createMusixMatchBooleanSchema(),
    has_lyrics_crowd: createMusixMatchBooleanSchema(),
    has_subtitles: createMusixMatchBooleanSchema(),
    has_richsync: createMusixMatchBooleanSchema(),
    has_track_structure: createMusixMatchBooleanSchema(),
    num_favourite: SafeType.Integer(),
    track_share_url: SafeType.String(),
    track_edit_url: SafeType.String(),
    commontrack_vanity_id: SafeType.Optional(SafeType.Integer()),
    first_release_date: SafeType.Optional(
        SafeType.String({ format: "date-time" })
    ),
});

export const musixMatchLyricsSchema = SafeType.Object({
    lyrics: SafeType.Pick(commonMusixMatchResponseProperties, [
        "lyrics_id",
        "can_edit",
        "check_validation_overrideable",
        "locked",
        "published_status",
        "action_requested",
        "verified",
        "restricted",
        "instrumental",
        "explicit",
        "lyrics_body",
        "lyrics_language",
        "lyrics_language_description",
        "script_tracking_url",
        "pixel_tracking_url",
        "html_tracking_url",
        "lyrics_copyright",
        "writer_list",
        "publisher_list",
        "backlink_url",
        "updated_time",
    ]),
});
export type MusixMatchLyrics = Static<typeof musixMatchLyricsSchema>;

export const musixMatchSubtitleSchema = SafeType.Object({
    subtitle: SafeType.Object({
        ...SafeType.Pick(commonMusixMatchResponseProperties, [
            "subtitle_id",
            "published_status",
            "subtitle_body",
            "subtitle_avg_count",
            "lyrics_copyright",
            "subtitle_length",
            "subtitle_language_description",
            "pixel_tracking_url",
            "script_tracking_url",
            "html_tracking_url",
            "updated_time",
            "restricted",
            "writer_list",
            "publisher_list",
        ]).properties,
    }),
});

export type MusixMatchSubtitle = Static<typeof musixMatchSubtitleSchema>;

export const musixMatchLyricsMoodSchema = SafeType.Object({
    mood_list: SafeType.Array(
        SafeType.Object({
            label: SafeType.String(),
            value: SafeType.Number(),
        })
    ),
});

export type MusixMatchLyricsMood = Static<typeof musixMatchLyricsMoodSchema>;

export const musixMatchSnippetSchema = SafeType.Object({
    snippet: SafeType.Pick(commonMusixMatchResponseProperties, [
        "snippet_body",
        "snippet_id",
        "restricted",
        "instrumental",
        "script_tracking_url",
        "html_tracking_url",
        "pixel_tracking_url",
        "updated_time",
    ]),
});

export type MusixMatchSnippet = Static<typeof musixMatchSnippetSchema>;

export const musixMatchRichsyncSchema = SafeType.Object({
    richsync: SafeType.Pick(commonMusixMatchResponseProperties, [
        "richsync_id",
        "richsync_body",
        "lyrics_copyright",
        "richsync_length",
        "richsync_language",
        "richsync_language_description",
        "richsync_avg_count",
        "restricted",
        "updated_time",
        "publisher_list",
        "writer_list",
        "script_tracking_url",
        "pixel_tracking_url",
        "html_tracking_url",
    ]),
});

export type MusixMatchRichsync = Static<typeof musixMatchRichsyncSchema>;

export const musixMatchLyricsTranslationSchema = SafeType.Object({
    lyrics: SafeType.Object({
        ...musixMatchLyricsSchema.properties.lyrics.properties,
        lyrics_translated: SafeType.Pick(commonMusixMatchResponseProperties, [
            "lyrics_body",
            "script_tracking_url",
            "pixel_tracking_url",
            "html_tracking_url",
            "selected_language",
            "restricted",
        ]),
    }),
});

export type MusixMatchLyricsTranslation = Static<
    typeof musixMatchLyricsTranslationSchema
>;

export const musixMatchSubtitleTranslationSchema = SafeType.Object({
    subtitle: SafeType.Object({
        ...musixMatchSubtitleSchema.properties.subtitle.properties,
        subtitle_translated: SafeType.Pick(commonMusixMatchResponseProperties, [
            "subtitle_body",
            "script_tracking_url",
            "pixel_tracking_url",
            "html_tracking_url",
            "selected_language",
            "restricted",
        ]),
    }),
});

export type MusixMatchSubtitleTranslation = Static<
    typeof musixMatchSubtitleTranslationSchema
>;

export const musixMatchGenresSchema = SafeType.Object({
    music_genre_list: SafeType.Array(
        SafeType.Pick(commonMusixMatchResponseProperties, ["music_genre"])
    ),
});

export type MusixMatchGenre = Static<typeof musixMatchGenresSchema>;

export const musixMatchArtistSchema = SafeType.Object({
    artist: SafeType.Object({
        ...SafeType.Pick(commonMusixMatchResponseProperties, [
            "artist_id",
            "artist_fq_id",
            "artist_mbid",
            "artist_name",
            "artist_name_translation_list",
            "artist_comment",
            "artist_country",
            "artist_alias_list",
            "artist_rating",
            "artist_twitter_url",
            "artist_website_url",
            "artist_tiktok_url",
            "artist_facebook_url",
            "artist_youtube_url",
            "artist_vanity_url",
            "artist_edit_url",
            "artist_share_url",
            "restricted",
            "managed",
            "updated_time",
            "externals_ids",
            "begin_date_year",
            "begin_date",
            "end_date_year",
            "end_date",
        ]).properties,
        primary_genres: SafeType.Optional(musixMatchGenresSchema),
        secondary_genres: SafeType.Optional(musixMatchGenresSchema),
        artist_credits: SafeType.Unknown(),
    }),
});

export type MusixMatchArtist = Static<typeof musixMatchArtistSchema>;

export const musixMatchArtistListSchema = SafeType.Object({
    artist_list: SafeType.Array(musixMatchArtistSchema),
});

export type MusixMatchArtistList = Static<typeof musixMatchArtistListSchema>;

export const musixMatchAlbumSchema = SafeType.Object({
    album: SafeType.Object({
        ...SafeType.Pick(commonMusixMatchResponseProperties, [
            "album_id",
            "album_mbid",
            "album_name",
            "album_rating",
            "album_track_count",
            "album_release_date",
            "album_release_type",
            "artist_id",
            "artist_name",
            "album_pline",
            "album_copyright",
            "album_label",
            "album_vanity_id",
            "album_edit_url",
            "restricted",
            "updated_time",
            "externals_ids",
            "album_coverart_100x100",
            "album_coverart_350x350",
            "album_coverart_500x500",
            "album_coverart_800x800",
        ]).properties,
        primary_genres: musixMatchGenresSchema,
        secondary_genres: SafeType.Optional(musixMatchGenresSchema),
    }),
});

export type MusixMatchAlbum = Static<typeof musixMatchAlbumSchema>;

export const musixMatchAlbumListSchema = SafeType.Object({
    album_list: SafeType.Array(musixMatchAlbumSchema),
});

export type MusixMatchAlbumList = Static<typeof musixMatchArtistListSchema>;

export const musixMatchTrackSchema = SafeType.Object({
    track: SafeType.Object({
        ...SafeType.Pick(commonMusixMatchResponseProperties, [
            "track_id",
            "track_mbid",
            "track_isrc",
            "commontrack_isrcs",
            "track_spotify_id",
            "commontrack_spotify_ids",
            "commontrack_itunes_ids",
            "track_soundcloud_id",
            "track_xboxmusic_id",
            "track_name",
            "track_name_translation_list",
            "track_rating",
            "track_length",
            "commontrack_id",
            "instrumental",
            "explicit",
            "has_lyrics",
            "has_lyrics_crowd",
            "has_subtitles",
            "has_richsync",
            "has_track_structure",
            "num_favourite",
            "lyrics_id",
            "subtitle_id",
            "album_id",
            "album_name",
            "album_vanity_id",
            "artist_id",
            "artist_mbid",
            "artist_name",
            "album_coverart_100x100",
            "album_coverart_350x350",
            "album_coverart_500x500",
            "album_coverart_800x800",
            "track_share_url",
            "track_edit_url",
            "commontrack_vanity_id",
            "restricted",
            "first_release_date",
            "updated_time",
        ]).properties,
        primary_genres: musixMatchGenresSchema,
        secondary_genres: SafeType.Optional(musixMatchGenresSchema),
    }),
});

export type MusixMatchTrack = Static<typeof musixMatchTrackSchema>;

export const musixMatchTrackListSchema = SafeType.Object({
    track_list: SafeType.Array(musixMatchTrackSchema),
});

export const MusixMatchStatusCode = SafeType.Union([
    SafeType.Literal(200),
    SafeType.Literal(400),
    SafeType.Literal(401),
    SafeType.Literal(402),
    SafeType.Literal(403),
    SafeType.Literal(404),
    SafeType.Literal(405),
    SafeType.Literal(500),
    SafeType.Literal(503),
]);

export type MusixMatchStatusCode = Static<typeof MusixMatchStatusCode>;
