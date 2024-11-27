import { faker } from "@faker-js/faker";
import { hardCodedSongs } from "./hardCodedSongs.js";
import { hardCodedSettings } from "../utils/settings.js";
import {
    getSeveralTracks,
    TrackObject,
    ArtistObject,
    getMultipleArtists,
} from "../apiCodegen/spotify.js";
import { RequireSpotify } from "../spotify/helpers.js";
import { hardCodedArtists } from "./hardcodedArtists.js";
import { DeepRequired } from "ts-essentials";

export function getRandomHardCodedSnippet() {
    return "This is a random offline snippet!";
}

export function getRandomHardCodedLine() {
    return "This is a random offline line!";
}

export function getShuffledHardCodedSongs(artistId: string) {
    const allSongs = hardCodedSongs;
    const allSongsFromArtist = allSongs.filter((s) =>
        s.artists.some((a) => a.id === artistId)
    );

    return faker.helpers.shuffle(allSongsFromArtist);
}

export async function getSeveralMaybeHardCodedTracks(
    tracksIds: string[]
): Promise<DeepRequired<TrackObject[]>> {
    if (hardCodedSettings.shouldWorkOffline) {
        return hardCodedSongs.filter((s) =>
            tracksIds.includes(s.id)
        ) as DeepRequired<TrackObject[]>;
    }

    return (
        (await getSeveralTracks({
            ids: tracksIds.join(","),
        })) as RequireSpotify<typeof getSeveralTracks>
    ).tracks;
}

export async function getSeveralMaybeHardCodedArtists(
    artistIds: string[]
): Promise<DeepRequired<ArtistObject[]>> {
    if (hardCodedSettings.shouldWorkOffline) {
        return hardCodedArtists.filter((a) => artistIds.includes(a.id));
    }

    return (
        (await getMultipleArtists({
            ids: artistIds.join(","),
        })) as RequireSpotify<typeof getMultipleArtists>
    ).artists;
}
