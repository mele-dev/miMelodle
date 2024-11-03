import { randomInt } from "crypto";
import MusixmatchAPI from "../musixmatch-api/musixmatch.js";

/**
 * @param songPoolSize
 * Songs will be chosen from the first songPoolSize songs, sorted by popularity.
 */
export async function getRandomPopularSong(opts: {
    songPoolSize: number;
    bias: "less popular" | "more popular" | "random";
    baseUrl?: string;
}) {
    const api = new MusixmatchAPI(opts.baseUrl);
    const pageSize = 100;

    let index = randomInt(0, opts.songPoolSize);

    if (opts.bias !== "random") {
        index = applyBiasEasing(index, opts.songPoolSize, opts.bias);
    }

    while (true) {
        const pageIndex = Math.floor(index / pageSize);
        const withinPageIndex = index % pageSize;
 
        // TODO: FIX getting error when calling this.
        const result = await api.searchTrack({
            page: pageIndex,
            page_size: pageSize,
            f_has_lyrics: 1,
        });

        const body = result.expect().body;

        // If we are past the last page (musixmatch returns empty array).
        if (Array.isArray(body) || body.track_list.length === 0) {
            if (index === 0) {
                throw "No songs available.";
            }
            // Search for a lower index via binary search.
            index = Math.floor(index / 2);
            continue;
        }

        // If we find a
        if (body.track_list.length > withinPageIndex) {
            return { ...body.track_list[withinPageIndex], top: index };
        }

        // If we are past the end of the dataset, but this page has songs,
        // grab the last song in the page.
        return body.track_list[body.track_list.length - 1];
    }
}

function applyBiasEasing(
    initialIndex: number,
    maxIndex: number,
    popularityBias: "less popular" | "more popular"
) {
    const biasRatio = initialIndex / maxIndex;
    const easedBiasRatio =
        popularityBias === "more popular"
            ? Math.pow(biasRatio, 1.5)
            : Math.pow(biasRatio, 0.5);

    return Math.floor(easedBiasRatio * maxIndex);
}
