import axios, { AxiosResponse } from "axios";
import { typedEnv } from "../types/env.js";
import {
    musixMatchAlbumListSchema,
    musixMatchAlbumSchema,
    musixMatchArtistListSchema,
    musixMatchArtistSchema,
    musixMatchGenresSchema,
    musixMatchLyricsMoodSchema,
    musixMatchLyricsSchema,
    musixMatchLyricsTranslationSchema,
    MusixMatchQueryParams,
    musixMatchRichsyncSchema,
    musixMatchSnippetSchema,
    musixMatchSubtitleSchema,
    musixMatchSubtitleTranslationSchema,
    musixMatchTrackListSchema,
    musixMatchTrackSchema,
    PickMusixMatchQueryParams,
} from "../types/musixmatch.js";
import { TSchema } from "@sinclair/typebox";
import {
    MusixMatchResponse,
    RawMusixMatchResponse,
} from "./musixmatch-response.js";
import { nextMusixMatchToken } from "./musixmatch-token.js";

const url = "https://api.musixmatch.com/ws/1.1";

export class MusixmatchAPI {
    private apiKey?: string;
    private baseUrl: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey;
        this.baseUrl = url;
    }

    private async request<T extends TSchema>(
        endpoint: string,
        params: Partial<MusixMatchQueryParams>,
        schema: T
    ): Promise<MusixMatchResponse<T>> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response: AxiosResponse<RawMusixMatchResponse> =
                await axios.get(url, {
                    params: {
                        /* le paso la apiKey como primer parametro, desp los que
                         * estan definidios en el objeto params */
                        apikey: this.apiKey ?? nextMusixMatchToken(),
                        ...params,
                    },
                });

            console.log(response.data);
            const wrappedResponse = new MusixMatchResponse(
                response.data,
                schema
            );
            return wrappedResponse;
        } catch (error) {
            console.error("Error fetching data from Musixmatch API:", error);
            throw error;
        }
    }

    // ### Matcher

    public async getMatcherLyrics(
        opts:
            | PickMusixMatchQueryParams<"q_track" | "q_artist">
            | PickMusixMatchQueryParams<"track_isrc">
    ) {
        return this.request(
            "/matcher.lyrics.get",
            opts,
            musixMatchLyricsSchema
        );
    }

    public async getMatcherTrack(
        opts: PickMusixMatchQueryParams<"q_track", "q_artist" | "q_album">
    ) {
        return this.request("/matcher.track.get", opts, musixMatchTrackSchema);
    }

    public async getMatcherSubtitle(
        opts:
            | PickMusixMatchQueryParams<
                  "q_track",
                  | "q_artist"
                  | "f_subtitle_length"
                  | "f_subtitle_length_max_deviation"
              >
            | PickMusixMatchQueryParams<"track_isrc">
    ) {
        return this.request(
            "/matcher.subtitle.get",
            opts,
            musixMatchSubtitleSchema
        );
    }

    // ### Track

    getTrack(
        opts: PickMusixMatchQueryParams<
            undefined,
            "commontrack_id" | "track_isrc" | "track_id"
        >
    ) {
        return this.request("/track.get", opts, musixMatchTrackSchema);
    }

    searchTrack(
        opts: PickMusixMatchQueryParams<
            undefined,
            | "q_track"
            | "q_artist"
            | "q_lyrics"
            | "q_track_artist"
            | "q_writer"
            | "f_artist_id"
            | "f_music_genre_id"
            | "f_lyrics_language"
            | "f_has_lyrics"
            | "f_track_release_group_first_release_date_min"
            | "f_track_release_group_first_release_date_max"
            | "s_artist_rating"
            | "s_track_rating"
            | "quorum_factor"
            | "page"
            | "page_size"
        >
    ) {
        return this.request("/track.search", opts, musixMatchTrackListSchema);
    }

    getTrackLyrics(
        opts:
            | PickMusixMatchQueryParams<"commontrack_id">
            | PickMusixMatchQueryParams<"track_isrc">
            | PickMusixMatchQueryParams<"track_id">
    ) {
        return this.request("/track.lyrics.get", opts, musixMatchLyricsSchema);
    }

    /** This one seems to be useless, it always returns an empty array. - cr */
    getTrackLyricsMood(
        opts:
            | PickMusixMatchQueryParams<"track_id">
            | PickMusixMatchQueryParams<"commontrack_id">
            | PickMusixMatchQueryParams<"track_isrc">
    ) {
        return this.request(
            "/track.lyrics.mood.get",
            opts,
            musixMatchLyricsMoodSchema
        );
    }

    getTrackSnippet(
        opts:
            | PickMusixMatchQueryParams<"track_id">
            | PickMusixMatchQueryParams<"commontrack_id">
            | PickMusixMatchQueryParams<"track_id">
    ) {
        return this.request(
            "/track.snippet.get",
            opts,
            musixMatchSnippetSchema
        );
    }

    /** We get 403 on this one - cr */
    getTrackSubtitle(
        opts: PickMusixMatchQueryParams<
            undefined,
            | "commontrack_id"
            | "track_id"
            | "track_isrc"
            | "subtitle_format"
            | "f_subtitle_length"
            | "f_subtitle_length_max_deviation"
        >
    ) {
        return this.request(
            "/track.subtitle.get",
            opts,
            musixMatchSubtitleSchema
        );
    }

    /** We get 403 on this one - cr */
    getTrackRichsync(
        opts: PickMusixMatchQueryParams<
            "track_id",
            "f_richsync_length" | "f_richsync_length_max_deviation"
        >
    ) {
        return this.request(
            "/track.richsync.get",
            opts,
            musixMatchRichsyncSchema
        );
    }

    /** Translations not enabled on free plan. */
    getTrackLyricsTranslation(
        opts: PickMusixMatchQueryParams<"selected_language", "min_completed"> &
            (
                | PickMusixMatchQueryParams<"commontrack_id">
                | PickMusixMatchQueryParams<"track_id">
                | PickMusixMatchQueryParams<"track_isrc">
            )
    ) {
        return this.request(
            "/track.lyrics.translation.get",
            opts,
            musixMatchLyricsTranslationSchema
        );
    }

    /** We get 403 on this one - cr */
    getTrackSubtitleTranslation(
        opts: PickMusixMatchQueryParams<
            "selected_language",
            | "min_completed"
            | "f_subtitle_length"
            | "f_subtitle_length_max_deviation"
        > &
            (
                | PickMusixMatchQueryParams<"commontrack_id">
                | PickMusixMatchQueryParams<"track_id">
                | PickMusixMatchQueryParams<"track_isrc">
            )
    ) {
        return this.request(
            "/track.subtitle.translation.get",
            opts,
            musixMatchSubtitleTranslationSchema
        );
    }

    // ### Artist
    getArtist(opts: PickMusixMatchQueryParams<"artist_id">) {
        return this.request("/artist.get", opts, musixMatchArtistSchema);
    }

    searchArtist(
        opts: PickMusixMatchQueryParams<
            "q_artist",
            "f_artist_id" | "page" | "page_size"
        >
    ) {
        return this.request("/artist.search", opts, musixMatchArtistListSchema);
    }

    getArtistAlbums(
        opts: PickMusixMatchQueryParams<
            "artist_id",
            "g_album_name" | "s_release_date" | "page" | "page_size"
        >
    ) {
        return this.request(
            "/artist.albums.get",
            opts,
            musixMatchAlbumListSchema
        );
    }

    getArtistRelated(
        opts: PickMusixMatchQueryParams<"artist_id", "page" | "page_size">
    ) {
        return this.request(
            "/artist.related.get",
            opts,
            musixMatchArtistListSchema
        );
    }

    // ### Album
    getAlbum(opts: PickMusixMatchQueryParams<"album_id">) {
        return this.request("/album.get", opts, musixMatchAlbumSchema);
    }

    getAlbumTracks(
        opts: PickMusixMatchQueryParams<
            "album_id",
            "f_has_lyrics" | "page" | "page_size"
        >
    ) {
        return this.request(
            "/album.tracks.get",
            opts,
            musixMatchTrackListSchema
        );
    }

    // ### Charts
    public async getTrackCharts(
        opts: PickMusixMatchQueryParams<
            undefined,
            "page" | "page_size" | "chart_name" | "f_has_lyrics" | "country"
        >
    ) {
        return this.request(
            "/chart.tracks.get",
            opts,
            musixMatchTrackListSchema
        );
    }

    getArtistCharts(
        opts: PickMusixMatchQueryParams<"page" | "page_size", "country">
    ) {
        return this.request(
            "/chart.artists.get",
            opts,
            musixMatchArtistListSchema
        );
    }

    getMusicGenres() {
        return this.request("/music.genres.get", {}, musixMatchGenresSchema);
    }

    // NOTE: I didn't implement "More" endpoints since I doubt we'll use them.
}
export default MusixmatchAPI;
