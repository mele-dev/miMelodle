import { faker } from "@faker-js/faker";
import {
    AlbumBaseAlbumType,
    ArtistDiscographyAlbumObject,
    getAnAlbumsTracks,
    getAnArtistsAlbums,
    getTrack,
    SimplifiedTrackObject,
    TrackObject,
} from "../apiCodegen/spotify.js";
import { DeepRequired } from "ts-essentials";
import { hardCodedSettings } from "../utils/settings.js";
import { getShuffledHardCodedSongs } from "../hardcoded/hardCodedUtils.js";

export type RequireSpotify<T extends (...args: never) => unknown> =
    DeepRequired<Awaited<ReturnType<T>>>;

/**
 * This method is expensive in terms of spotify api tokens.
 * It can potentially make up to 51 requests.
 */
export async function getAllTracksFromArtist(
    artistId: string,
    groups: AlbumBaseAlbumType[]
) {
    const albums = await getAnArtistsAlbums(artistId, {
        limit: 50,
        include_groups: groups.join(","),
    });

    if (albums.total === 0) {
        return null;
    }

    const outputPromise = albums.items?.map(async (album) => {
        return {
            ...album,
            tracks:
                (await getAnAlbumsTracks(album.id, { limit: 50 })).items ?? [],
        };
    });

    if (outputPromise === undefined) {
        return null;
    }

    return {
        ...albums,
        albums: await Promise.all(outputPromise),
    };
}

/**
 * ### COST
 * This method will usually find the track in two api calls, but it theoretically
 * can do (artistIds.length * 51) api calls. I don't think we should worry
 * about that, it would only happen if every album in every artist is empty,
 * which doesn't make sense to ever happen.
 */
export async function getRandomTrackFromArtists(opts: {
    artistsIds: string[];
    groups: AlbumBaseAlbumType[];
    mustHaveLyrics?: "TODO" | true;
}): Promise<{
    track: TrackObject;
} | null> {
    // I don't want to modify a parameter, so I make a copy instead of shuffling
    // in place.
    const artistIds = faker.helpers.shuffle(opts.artistsIds, {
        inplace: false,
    });

    while (artistIds.length > 0) {
        const chosenArtistId = artistIds.pop();

        if (chosenArtistId === undefined) {
            break;
        }

        if (hardCodedSettings.shouldWorkOffline) {
            const output = {
                track: getShuffledHardCodedSongs(chosenArtistId)?.[0],
            };
            if (output.track === undefined) {
                continue;
            }
            return output;
        }

        const artistAlbums = await getAnArtistsAlbums(chosenArtistId, {
            include_groups: opts.groups.join(","),
            limit: 50,
        });

        if (
            artistAlbums.items === undefined ||
            artistAlbums.items.length === 0
        ) {
            continue;
        }

        const albums = weighedShuffle(
            artistAlbums.items,
            (album) => album.total_tracks,
            (a, b) => a.id === b.id
        ).toReversed();

        while (albums.length > 0) {
            const chosenAlbum = albums.pop();

            if (chosenAlbum === undefined) {
                break;
            }

            const tracks = await getAnAlbumsTracks(chosenAlbum.id, {
                limit: 50,
            });

            if (tracks.items === undefined || tracks.items.length === 0) {
                continue;
            }

            return {
                track: await getTrack(
                    faker.helpers.arrayElement(tracks.items).id!
                ),
                //album: chosenAlbum,
            };
        }
    }

    return null;
}

/**
 * Returns a shuffled array which is most likely to contain higher weighted
 * elements at the start of the array.
 */
function weighedShuffle<T>(
    items: T[],
    weightCalculator: (item: T) => number,
    equalityChecker: (a: T, b: T) => boolean
) {
    let weighedItems = items.map((value) => {
        return {
            value,
            weight: weightCalculator(value),
        };
    });

    const output = [];

    while (weighedItems.length !== 0) {
        const chosenItem = faker.helpers.weightedArrayElement(weighedItems);

        weighedItems = weighedItems.filter(
            (val) => !equalityChecker(val.value, chosenItem)
        );

        output.push(chosenItem);
    }

    return output;
}
