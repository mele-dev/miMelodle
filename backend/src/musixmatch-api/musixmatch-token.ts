import { typedEnv } from "../types/env.js";

const tokensMap = {
    cr: ["b587fc7ee98849bfc1b44830a63d0dc4"],
    juan: [],
    ines: ["b7607e8396657e88bf3317f583588585"],
} satisfies Record<"cr" | "juan" | "ines", string[]>;

const allTokens = Object.values(tokensMap).flat();

let i = 0;

export function nextMusixMatchToken() {
    if (typedEnv.NODE_ENV === "production") {
        return typedEnv.MUSIXMATCH_KEY;
    }

    const output = allTokens[i];
    i = (i + 1) % allTokens.length;

    return output;
}
