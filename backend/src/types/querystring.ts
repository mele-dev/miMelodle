import { SafeType } from "../utils/typebox.js";

export const queryStringSchema = SafeType.Object({
    query: SafeType.String({
        minLength: 3,
        maxLength: 100,
        description: "A query to search for an element with a fuzzy algorithm.",
    }),
    pageSize: SafeType.Integer({
        minimum: 1,
        maximum: 100,
        description: "The size of page with which to split results.",
    }),
    page: SafeType.Integer({
        description: "The page to index into, starting at 0.",
    }),
});
