import { typedEnv } from "../types/env.js";

type Developer = "cr" | "juan" | "ines";

const tokensMap: Record<Developer, string[]> = {
    cr: [
        //"b52091f915524eae8cb88c4df3e51dc0",
         "b587fc7ee98849bfc1b44830a63d0dc4",
    ],
    juan: [],
    ines: [
         "b7607e8396657e88bf3317f583588585"
    ],
};

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
