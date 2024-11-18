import {
    getMultipleArtists,
    getSeveralTracks,
    getTrack,
    TrackObject,
} from "../apiCodegen/spotify.js";
import {
    getGuessLineFromUser,
    getGuessSongFromUser,
} from "../queries/dml.queries.js";
import {
    GuessSongHints,
    GuessSongGameInformation,
    GuessLineGameInformation,
} from "../types/game.js";
import { runPreparedQuery } from "./database.js";
import MusixmatchAPI from "../musixmatch-api/musixmatch.js";
import { RequireSpotify } from "../spotify/helpers.js";
import { DeepRequired } from "ts-essentials";
import { faker } from "@faker-js/faker";

export function checkSongGuess(opts: {
    targetTrack: DeepRequired<TrackObject>;
    trackToCompare: DeepRequired<TrackObject>;
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
        guessedTrack: trackToCompare,
        guessedTrackNameHint: titleHint ?? "",
        isCorrectTrack: targetTrack.id === trackToCompare.id,
    };
}

type GuessSongResult =
    | { status: "NoGame" }
    | { status: "AttemptsExhausted" }
    | { status: "NotYourGame" }
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

    if (opts.newGuess && gameInfo[0].userId !== opts.selfId) {
        return { status: "NotYourGame" };
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

    const artists = (await getMultipleArtists({
        ids: hiddenTrack.artists.map((a) => a.id).join(","),
    })) as RequireSpotify<typeof getMultipleArtists>;

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

    let albumHints: GuessSongGameInformation["album"] = {
        images: albumInfo?.images,
    };

    const hasWon = attemptHints.some((a) => a.isCorrectAlbum);

    if (hasWon) {
        albumHints = albumInfo;
    }

    const gameHasEnded = gameInfo.length >= 6 || hasWon;

    return {
        status: "Success",
        hints: {
            attempts: attemptHints,
            album: albumHints,
            artists: artists.artists,
            snippet: gameInfo[0].snippet ?? undefined,
            correctTrack: gameHasEnded ? hiddenTrack : undefined,
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

export async function getTrackLine(trackIsrc: string) {
    const api = new MusixmatchAPI();

    const lyricsResponse = await api.getTrackLyrics({
        track_isrc: trackIsrc,
    });

    if (!lyricsResponse.parse()) {
        return null;
    }

    const lyrics = lyricsResponse.body.lyrics.lyrics_body;

    const filtered = lyrics.split(
        "\n...\n\n******* This Lyrics is NOT for Commercial use *******"
    )[0];

    const split = filtered.split("\n").filter(Boolean);

    return faker.helpers.arrayElement(split);
}

type GuessLineResult =
    | { status: "NoGame" }
    | { status: "NotYourGame" }
    | { status: "AttemptsExhausted" }
    | { status: "RepeatedLine" }
    | { status: "AlreadyWon" }
    | { status: "WrongGuessLength" }
    | { status: "Success"; hints: GuessLineGameInformation };

export async function getGuessLineInformation(opts: {
    selfId: number;
    gameId: number;
    newGuess?: string;
}): Promise<GuessLineResult> {
    const gameInfo = await runPreparedQuery(getGuessLineFromUser, opts);

    if (gameInfo.length === 0) {
        return { status: "NoGame" };
    }

    if (opts.newGuess && gameInfo[0].userId !== opts.selfId) {
        return { status: "NotYourGame" };
    }

    if (opts.newGuess && gameInfo.length >= 6) {
        return { status: "AttemptsExhausted" };
    }

    // TODO: remove assertion (should go away when re-running init)
    const hiddenSnippet = gameInfo[0].snippet!;

    const attempts = gameInfo.map((i) => i.guessedSnippet).filter(Boolean);

    if (opts.newGuess && attempts.includes(opts.newGuess)) {
        return { status: "RepeatedLine" };
    }

    if (opts.newGuess && attempts.includes(hiddenSnippet)) {
        return { status: "AlreadyWon" };
    }

    if (opts.newGuess) {
        attempts.push(opts.newGuess);
    }

    const attemptHints = attempts.map((attempt) => {
        return {
            snippetHint: attempt
                .split("")
                .map((char, i) => {
                    if (char.toLowerCase() === hiddenSnippet[i].toLowerCase()) {
                        return hiddenSnippet[i];
                    }

                    if (hiddenSnippet.toLowerCase().includes(char.toLowerCase())) {
                        return "~";
                    }

                    return "_";
                })
                .join(""),
            guessedLine: attempt,
        };
    });

    const hasWon = attempts.some(a => a.toLowerCase() === hiddenSnippet.toLowerCase());
    const hasLost = !hasWon && attempts.length >= 6;
    const hasEnded = hasWon || hasLost;

    const track = (await getTrack(
        gameInfo[0].spotifyTrackId
    )) as RequireSpotify<typeof getTrack>;

    return {
        status: "Success",
        hints: {
            attempts: attemptHints,
            snippetLength: hiddenSnippet.length,
            track,
            snippet: hasEnded ? hiddenSnippet : undefined,
        },
    };
}
