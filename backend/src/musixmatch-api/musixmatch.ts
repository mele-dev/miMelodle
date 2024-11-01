import axios, { AxiosResponse } from "axios";
import { typedEnv } from "../types/env.js";
import { MusixMatchTrack, MusixMatchTrackList } from "../types/track.js";
import {
    MusixMatchAlbum,
    MusixMatchAlbumList,
    MusixMatchArtist,
    MusixMatchArtistList,
    MusixMatchLyrics,
    MusixMatchLyricsMood,
    MusixMatchLyricsTranslation,
    MusixMatchQueryParams,
    MusixMatchRichsync,
    MusixMatchSnippet,
    MusixMatchSubtitle,
    MusixMatchSubtitleTranslation,
    PickMusixMatchQueryParams,
} from "../types/musixmatch.js";

const url = "https://api.musixmatch.com/ws/1.1";

interface MusixmatchResponse<T> {
    message: {
        body: T;
    };
}

export class MusixmatchAPI {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey?: string) {
        this.apiKey = apiKey || typedEnv.MUSIXMATCH_KEY;
        this.baseUrl = url;
    }

    private async request<T>(
        endpoint: string,
        /* uso record para asegurar que el tipado de k/v siempre sea string string */
        params: Partial<MusixMatchQueryParams>
    ): Promise<T> {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const response: AxiosResponse<MusixmatchResponse<T>> =
                await axios.get(url, {
                    params: {
                        /* le paso la apiKey como primer parametro, desp los que
                         * estan definidios en el objeto params */
                        apikey: this.apiKey,
                        ...params,
                    },
                });
            return response.data.message.body;
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
        return this.request<MusixMatchLyrics>("/matcher.lyrics.get", opts);
    }

    public async getMatcherTrack(
        opts: PickMusixMatchQueryParams<"q_track" | "q_artist" | "q_album">
    ) {
        return this.request<MusixMatchTrack>("/matcher.lyrics.get", opts);
    }

    public async getMatcherSubtitle(
        opts:
            | PickMusixMatchQueryParams<
                  "q_track" | "q_artist" | "f_subtitle_length",
                  "f_subtitle_length_max_deviation"
              >
            | PickMusixMatchQueryParams<"track_isrc">
    ) {
        return this.request<MusixMatchSubtitle>("/matcher.subtitle.get", opts);
    }

    // ### Track

    getTrack(
        opts: PickMusixMatchQueryParams<
            undefined,
            "commontrack_id" | "track_isrc" | "track_id"
        >
    ) {
        return this.request<MusixMatchTrack>("/track.get", opts);
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
        return this.request<MusixMatchTrackList>("/track.search", opts);
    }

    getTrackLyrics(
        opts:
            | PickMusixMatchQueryParams<"commontrack_id">
            | PickMusixMatchQueryParams<"track_isrc">
            | PickMusixMatchQueryParams<"track_id">
    ) {
        return this.request<MusixMatchLyrics>("/track.lyrics.get", opts);
    }

    getTrackLyricsMood(
        opts:
            | PickMusixMatchQueryParams<"commontrack_id">
            | PickMusixMatchQueryParams<"track_isrc">
    ) {
        return this.request<MusixMatchLyricsMood>(
            "/track.lyrics.mood.get",
            opts
        );
    }

    getTrackSnippet(
        opts:
            | PickMusixMatchQueryParams<"commontrack_id">
            | PickMusixMatchQueryParams<"track_id">
    ) {
        return this.request<MusixMatchSnippet>("/track.snippet.get", opts);
    }

    getTrackSubtitle(
        opts: PickMusixMatchQueryParams<
            "commontrack_id",
            | "subtitle_format"
            | "f_subtitle_length"
            | "f_subtitle_length_max_deviation"
        >
    ) {
        return this.request<MusixMatchSubtitle>("/track.subtitle.get", opts);
    }

    getTrackRichsync(
        opts: PickMusixMatchQueryParams<
            "track_id",
            "f_richsync_length" | "f_richsync_length_max_deviation"
        >
    ) {
        return this.request<MusixMatchRichsync>("/track.richsync.get", opts);
    }

    getTrackLyricsTranslation(
        opts: PickMusixMatchQueryParams<"selected_language", "min_completed"> &
            (
                | PickMusixMatchQueryParams<"commontrack_id">
                | PickMusixMatchQueryParams<"track_id">
                | PickMusixMatchQueryParams<"track_isrc">
            )
    ) {
        return this.request<MusixMatchLyricsTranslation>(
            "/track.lyrics.translation.get",
            opts
        );
    }

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
        return this.request<MusixMatchSubtitleTranslation>(
            "/track.subtitle.translation.get",
            opts
        );
    }

    // ### Artist
    getArtist(opts: PickMusixMatchQueryParams<"artist_id">) {
        return this.request<MusixMatchArtist>("/artist.get", opts);
    }

    searchArtist(
        opts: PickMusixMatchQueryParams<
            "q_artist",
            "f_artist_id" | "page" | "page_size"
        >
    ) {
        return this.request<MusixMatchArtistList>("/artists.search", opts);
    }

    getArtistAlbums(
        opts: PickMusixMatchQueryParams<
            "artist_id",
            "g_album_name" | "s_release_date" | "page" | "page_size"
        >
    ) {
        return this.request<MusixMatchAlbumList>("/artist.albums.get", opts);
    }

    getArtistRelated(
        opts: PickMusixMatchQueryParams<"artist_id", "page" | "page_size">
    ) {
        return this.request<MusixMatchArtistList>("/artist.related.get", opts);
    }

    // ### Album
    getAlbum(opts: PickMusixMatchQueryParams<"album_id">) {
        return this.request<MusixMatchAlbum>("/album.get", opts);
    }

    getAlbumTracks(
        opts: PickMusixMatchQueryParams<
            "album_id",
            "f_has_lyrics" | "page" | "page_size"
        >
    ) {
        return this.request<MusixMatchTrackList>("/album.tracks.get", opts);
    }

    // ### Charts
    public async getTrackCharts(
        opts: PickMusixMatchQueryParams<
            "page" | "page_size" | "chart_name",
            "f_has_lyrics" | "country"
        >
    ) {
        return this.request<MusixMatchTrackList | []>(
            "/chart.tracks.get",
            opts
        );
    }

    getArtistCharts(
        opts: PickMusixMatchQueryParams<"page" | "page_size", "country">
    ) {
        return this.request<"TODO">("/chart.artists.get", opts);
    }

    getMusiGenresCharts(
        opts: PickMusixMatchQueryParams<
            "page" | "page_size" | "chart_name",
            "f_has_lyrics" | "country"
        >
    ) {
        return this.request<"TODO">("/chart.artists.get", opts);
    }

    // NOTE: I didn't implement "More" endpoints since I doubt we'll use them.
}
export default MusixmatchAPI;
