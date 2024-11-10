import { DeepRequired } from "ts-essentials";
import {
    getMultipleArtists,
    getSeveralTracks,
    TrackObject,
} from "../apiCodegen/spotify.js";
import { getGuessSongFromUser } from "../queries/dml.queries.js";
import {
    GuessSongHints,
    GuessSongGameInformation,
} from "../types/guessSong.js";
import { runPreparedQuery } from "./database.js";
import MusixmatchAPI from "../musixmatch-api/musixmatch.js";
import { RequireSpotify } from "../spotify/helpers.js";

export function checkSongGuess(opts: {
    targetTrack: TrackObject;
    trackToCompare: TrackObject;
}): GuessSongHints {
    const { targetTrack, trackToCompare } = opts;

    const titleHint = trackToCompare.name
        ?.split("")
        .map((value, index) =>
            value.toLowerCase() === targetTrack.name?.[index]?.toLowerCase()
                ? value
                : "_"
        )
        .join("");

    return {
        isCorrectAlbum: targetTrack.album?.id === trackToCompare.album?.id,
        guessedTrackAlbumName: trackToCompare.album?.name!,
        isCorrectTrack: targetTrack.id === trackToCompare.id,
        guessedTrackSpotifyId: trackToCompare.id!,
        guessedTrackNameHint: titleHint ?? "",
        guessedTrackName: trackToCompare.name!,
        guessedTrackAlbumImages: trackToCompare.album?.images ?? [],
    };
}

type GuessSongResult =
    | { status: "NoGame" }
    | { status: "AttemptsExhausted" }
    | { status: "RepeatedTrack" }
    | { status: "TrackNotFound" }
    | { status: "AlreadyWon" }
    | { status: "Success"; hints: GuessSongGameInformation };

export async function getGuessSongInformation(opts: {
    selfId: number;
    gameId: number;
    newGuess?: string;
}): Promise<GuessSongResult> {
    // All the attempt info is nullable here, pgtyped is dumb with
    // left joins.
    const gameInfo = await runPreparedQuery(getGuessSongFromUser, opts);

    if (gameInfo.length === 0) {
        return { status: "NoGame" };
    }

    if (opts.newGuess && gameInfo.length >= 6) {
        return { status: "AttemptsExhausted" };
    }

    const hiddenTrackId = gameInfo[0].spotifyTrackId;

    const existingAttemptsIds = gameInfo
        .map((row) => row.guessedSpotifyTrackId)
        .filter((id) => id !== null);

    if (opts.newGuess && existingAttemptsIds.includes(opts.newGuess)) {
        return { status: "RepeatedTrack" };
    }

    const idsExceptHidden = [...existingAttemptsIds, opts.newGuess].filter(
        (val) => val !== undefined
    );

    const idsToFetch = [hiddenTrackId, ...idsExceptHidden].join(",");

    const tracksInfo = (await getSeveralTracks({
        ids: idsToFetch,
    })) as RequireSpotify<typeof getSeveralTracks>;

    const hiddenTrack = tracksInfo.tracks.find((t) => t.id === hiddenTrackId)!;

    const artists = await getMultipleArtists({
        ids: hiddenTrack.artists.map((a) => a.id).join(","),
    }) as RequireSpotify<typeof getMultipleArtists>;

    const attemptHints: GuessSongHints[] = [];

    for (const id of idsExceptHidden) {
        const trackToCompare = tracksInfo.tracks.find((t) => t.id === id);

        if (hiddenTrack === undefined || trackToCompare === undefined) {
            return { status: "TrackNotFound" };
        }

        attemptHints.push(
            checkSongGuess({
                targetTrack: hiddenTrack,
                trackToCompare,
            })
        );
    }

    // If some attempt except the last one was correct, there can be no
    // more attempts made for this game.
    if (
        opts.newGuess === undefined &&
        attemptHints.some((val) => val.isCorrectTrack) &&
        !attemptHints[attemptHints.length - 1].isCorrectTrack
    ) {
        return { status: "AlreadyWon" };
    }

    const albumInfo = hiddenTrack?.album;

    const albumHints: Partial<GuessSongGameInformation["album"]> = {
        images: albumInfo?.images,
    };

    if (attemptHints.some((a) => a.isCorrectAlbum)) {
        albumHints.name = albumInfo?.name;
    }

    return {
        status: "Success",
        hints: {
            attempts: attemptHints,
            album: albumHints,
            artists: artists.artists,
            snippet: gameInfo[0].snippet ?? undefined,
        },
    };
}

export async function getTrackSnippet(trackIsrc: string) {
    const api = new MusixmatchAPI();

    const result = await api.getTrackSnippet({
        track_isrc: trackIsrc,
    });

    if (result.headers.status_code === 404) {
        return undefined;
    }

    return result.expect().snippet.snippet_body;
}
