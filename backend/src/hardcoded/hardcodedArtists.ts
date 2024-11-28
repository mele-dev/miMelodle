import { Static } from "@sinclair/typebox";
import { spotifyArtistSchema } from "../types/spotify.js";

export const hardCodedArtists = [{
    external_urls: {
        spotify: "https://open.spotify.com/artist/13JJKrUewC1CJYmIDXQNoH",
    },
    followers: {
        href: null,
        total: 2412246,
    },
    genres: ["rock uruguayo"],
    href: "https://api.spotify.com/v1/artists/13JJKrUewC1CJYmIDXQNoH",
    id: "13JJKrUewC1CJYmIDXQNoH",
    images: [
        {
            url: "https://i.scdn.co/image/ab6761610000e5eb4e75c94ad7365dfcdb3201bf",
            height: 640,
            width: 640,
        },
        {
            url: "https://i.scdn.co/image/ab676161000051744e75c94ad7365dfcdb3201bf",
            height: 320,
            width: 320,
        },
        {
            url: "https://i.scdn.co/image/ab6761610000f1784e75c94ad7365dfcdb3201bf",
            height: 160,
            width: 160,
        },
    ],
    name: "El Cuarteto De Nos",
    popularity: 71,
    type: "artist",
    uri: "spotify:artist:13JJKrUewC1CJYmIDXQNoH",
}] as unknown as Static<typeof spotifyArtistSchema>[];
