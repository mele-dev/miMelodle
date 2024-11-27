import { Static } from "@sinclair/typebox";
import fs from "fs";
import {
    spotifySimplifiedTrackSchema,
    spotifyTrackSchema,
} from "../types/spotify.js";

const simplifiedFile = fs.readFileSync(
    process.cwd() + "/src/hardcoded/hardCodedSongs.json"
);

export const hardCodedSimplifiedSongs = JSON.parse(
    simplifiedFile.toString()
) as Static<typeof spotifySimplifiedTrackSchema>[];

const file = fs.readFileSync(process.cwd() + "/src/hardcoded/fullSongs.json");

export const hardCodedSongs = JSON.parse(file.toString()) as Static<
    typeof spotifyTrackSchema
>[];
