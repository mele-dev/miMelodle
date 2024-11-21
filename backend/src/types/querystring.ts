import { SafeType } from "../utils/typebox.js";
import { MelodleGameSchema } from "./melodle.js";

export const queryStringSchema = SafeType.Object({
    spotifySearchQuery: SafeType.String({
        minLength: 1,
        maxLength: 100,
        description: `Your search query.

You can narrow down your search using field filters. The available filters are album, artist, track, year, upc, tag:hipster, tag:new, isrc, and genre. Each field filter only applies to certain result types.

The artist and year filters can be used while searching albums, artists and tracks. You can filter on a single year or a range (e.g. 1955-1960).
The album filter can be used while searching albums and tracks.
The genre filter can be used while searching artists and tracks.
The isrc and track filters can be used while searching tracks.
The upc, tag:new and tag:hipster filters can only be used while searching albums. The tag:new filter will return albums released in the past two weeks and tag:hipster can be used to return only albums with the lowest 10% popularity.`,
    }),
    query: SafeType.String({
        minLength: 3,
        maxLength: 100,
        description: "A query to search for an element with a fuzzy algorithm.",
    }),
    pageSize: SafeType.Integer({
        minimum: 1,
        // Set it to 50 because it's spotify max page size.
        maximum: 50,
        description: "The size of page with which to split results.",
    }),
    page: SafeType.Integer({
        description: "The page to index into, starting at 0.",
    }),
    spotifyQueryType: SafeType.Array(
        SafeType.StringEnum([
            "artist",
            "track",
            "album",
            "playlist",
            "show",
            "episode",
            "audiobook",
        ])
    ),
    gameMode: MelodleGameSchema.properties.gameMode,
});
