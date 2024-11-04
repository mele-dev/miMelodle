import { SafeType } from "../utils/typebox.js";

export const queryStringSchema = SafeType.Object({
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
            "album",
            "artist",
            "playlist",
            "track",
            "show",
            "episode",
            "audiobook",
        ])
    ),
});
