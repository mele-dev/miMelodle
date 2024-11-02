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

        const result = await api.getTrackCharts({
            page: pageIndex,
            // We ask for page size other than 1, since there is a hard limit
            // of 100 on the page you can request.
            page_size: pageSize,
            f_has_lyrics: 1,
            chart_name: "mxmweekly",
        });

        const body = result.message.body;

        // If we are past the last page (musixmatch returns empty array).
        if (Array.isArray(body) || body.track_list.length === 0) {
            console.info("Returned array", body);
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
