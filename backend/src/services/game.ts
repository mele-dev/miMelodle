import { randomInt } from "crypto";
import MusixmatchAPI from "../musixmatch-api/musixmatch.js";

/**
 * @param songPoolSize
 * Songs will be chosen from the first songPoolSize songs, sorted by popularity.
 */
export async function getRandomPopularSong(songPoolSize: number) {
    const api = new MusixmatchAPI();

    const index = randomInt(0, songPoolSize);
}
