import { SafeType } from "../utils/typebox.js";
import { TArray, TSchema, TUnsafe } from "@sinclair/typebox";
import {
    AlbumObject,
    ArtistObject,
    CopyrightObject,
    ImageObject,
    PagingObject,
    SimplifiedAlbumObject,
    SimplifiedArtistObject,
    SimplifiedTrackObject,
    TrackObject,
} from "../apiCodegen/spotify.js";

export const spotifyImageSchema = SafeType.Object({
    url: SafeType.String(),
    width: SafeType.Union([SafeType.Integer(), SafeType.Null()]),
    height: SafeType.Union([SafeType.Integer(), SafeType.Null()]),
} satisfies { [K in keyof ImageObject]: unknown });

export const spotifyImagesSchema = SafeType.Array(spotifyImageSchema);

export const artistSchema = SafeType.Object(
    {
        id: SafeType.Integer({
            description:
                "A numeric identifier for an artist. Generated by the backend, " +
                "unique and unchangeable.",
        }),
        musixmatchArtistId: SafeType.Integer({
            description: "Identifier for an artist given by MusixMatch",
        }),
        spotifyArtistId: SafeType.String({
            description: "Identifier for an artist given by spotify",
        }),
        artistIsrc: SafeType.String({
            description:
                "Identifier for an artist accepted by multiple platforms",
        }),
        name: SafeType.String({
            description: "Name of the artist, does not have to be unique.",
        }),
        imageUrls: SafeType.Optional(
            SafeType.String({
                description:
                    "Url to download the artist's portrait image, if available.",
            })
        ),
        images: SafeType.Array(spotifyImageSchema),
        externalUrls: SafeType.Object(
            {
                spotify: SafeType.String({
                    description:
                        "Url that will allow users to be redirected to the artist's profile on Spotify.",
                }),
            },
            { additionalProperties: true }
        ),
        genres: SafeType.Array(
            SafeType.String({
                description: "Genres associated with the artist.",
            })
        ),
        followers: SafeType.Object({
            href: SafeType.Nullable(SafeType.String()),
            total: SafeType.Number({
                description: "The number of followers the artist has.",
            }),
        }),
        popularity: SafeType.Number({
            description:
                "The popularity of the artist. " +
                "The value will be between 0 and 100, with 100 being the most popular. " +
                "The artist's popularity is calculated from the popularity of all the artist's tracks.",
        }),
    },
    {
        $id: "ArtistSchema",
        title: "artistSchema",
    }
);

// I have not done every property yet.
export const albumSchema = SafeType.Object({
    images: spotifyImagesSchema,
    name: SafeType.String(),
    genres: SafeType.Array(SafeType.String()),
    id: SafeType.String(),
    uri: SafeType.String(),
    type: SafeType.Literal("album"),
    href: SafeType.String(),
    label: SafeType.String(),
} satisfies Partial<{ [K in keyof AlbumObject]: TUnsafe<AlbumObject[K]> }>);

export function createSpotifyPagination<TTSchema extends TSchema>(
    innerSchema: TTSchema
) {
    return SafeType.Object({
        limit: SafeType.Integer(),
        href: SafeType.String(),
        next: SafeType.Nullable(SafeType.String()),
        previous: SafeType.Nullable(SafeType.String()),
        total: SafeType.Integer(),
        offset: SafeType.Integer(),
        items: SafeType.Array(innerSchema),
    } satisfies { [K in keyof PagingObject]-?: TUnsafe<PagingObject[K]> } & {
        items: TArray<TTSchema>;
    });
}

export const spotifyExternalUrlsSchema = SafeType.Object(
    {
        spotify: SafeType.String(),
    },
    { additionalProperties: true }
);

export const spotifySimplifiedArtistSchema = SafeType.Object({
    external_urls: spotifyExternalUrlsSchema,
    href: SafeType.String(),
    id: SafeType.String(),
    name: SafeType.String(),
    type: SafeType.Literal("artist"),
    uri: SafeType.String(),
} satisfies {
    [K in keyof SimplifiedArtistObject]-?: TUnsafe<SimplifiedArtistObject[K]>;
});

export const spotifyArtistSchema = SafeType.Object({
    ...spotifySimplifiedArtistSchema.properties,
    followers: SafeType.Object({
        href: SafeType.Nullable(SafeType.String()),
        total: SafeType.Integer(),
    }),
    genres: SafeType.Array(SafeType.String()),
    images: spotifyImagesSchema,
    popularity: SafeType.Number({ minimum: 0, maximum: 100 }),
}) satisfies TUnsafe<Required<ArtistObject>>;

export const spotifyRestrictionsSchema = SafeType.Optional(
    SafeType.Object({
        reason: SafeType.StringEnum(["market", "product", "explicit"]),
    })
);

export const spotifySimplifiedTrackSchema = SafeType.Object({
    artists: SafeType.Array(spotifySimplifiedArtistSchema),
    available_markets: SafeType.Array(
        SafeType.String({ minLength: 2, maxLength: 2 })
    ),
    disc_number: SafeType.Integer(),
    duration_ms: SafeType.Integer(),
    explicit: SafeType.Boolean(),
    external_urls: spotifyExternalUrlsSchema,
    href: SafeType.String(),
    id: SafeType.String(),
    is_playable: SafeType.Optional(SafeType.Boolean()),
    linked_from: SafeType.Optional(
        SafeType.Partial(
            SafeType.Object(
                {
                    external_urls: spotifyExternalUrlsSchema,
                    href: SafeType.String(),
                    id: SafeType.String(),
                    type: SafeType.Literal("track"),
                    uri: SafeType.String(),
                },
                { additionalProperties: true }
            )
        )
    ),
    restrictions: SafeType.Optional(SafeType.String()) as any,
    name: SafeType.String(),
    preview_url: SafeType.Nullable(SafeType.String()),
    track_number: SafeType.Integer(),
    type: SafeType.Literal("track"),
    uri: SafeType.String(),
    is_local: SafeType.Boolean(),
} satisfies {
    [K in keyof SimplifiedTrackObject]-?: TUnsafe<SimplifiedTrackObject[K]>;
});

export const spotifyCopyrightObject = SafeType.Object({
    type: SafeType.String(),
    text: SafeType.String(),
}) satisfies TUnsafe<Required<CopyrightObject>>;

export const spotifyExternalIdsSchema = SafeType.Partial(
    SafeType.Object({
        isrc: SafeType.String(),
        ean: SafeType.String(),
        upc: SafeType.String(),
    })
);

const album_type = SafeType.StringEnum(["album", "single", "compilation"]);
const release_date_precision = SafeType.StringEnum(["year", "month", "day"]);

export const spotifyAlbumSchema = SafeType.Object({
    album_type,
    release_date_precision,
    total_tracks: SafeType.Integer(),
    available_markets: SafeType.Array(
        SafeType.String({ minLength: 2, maxLength: 2 })
    ),
    external_urls: spotifyExternalUrlsSchema,
    href: SafeType.String(),
    id: SafeType.String(),
    images: spotifyImagesSchema,
    name: SafeType.String(),
    release_date: SafeType.String(),
    restrictions: spotifyRestrictionsSchema,
    type: SafeType.Literal("album"),
    uri: SafeType.String(),
    artists: SafeType.Array(spotifySimplifiedArtistSchema),
    tracks: createSpotifyPagination(spotifySimplifiedTrackSchema),
    copyrights: SafeType.Array(spotifyCopyrightObject),
    external_ids: spotifyExternalIdsSchema,
    genres: SafeType.Array(SafeType.String()),
    label: SafeType.String(),
    popularity: SafeType.Number({ minimum: 0, maximum: 100 }),
} satisfies {
    [K in keyof AlbumObject]-?: TUnsafe<AlbumObject[K]>;
});

export const simplifiedAlbumSchema = SafeType.Pick(spotifyAlbumSchema, [
    "album_type",
    "available_markets",
    "external_urls",
    "id",
    "href",
    "images",
    "name",
    "release_date",
    "release_date_precision",
    "total_tracks",
    "type",
    "uri",
    "artists",
]) satisfies TUnsafe<SimplifiedAlbumObject>;

export const spotifyTrackSchema = SafeType.Object({
    ...spotifySimplifiedTrackSchema.properties,
    album: simplifiedAlbumSchema,
    artists: SafeType.Array(spotifySimplifiedArtistSchema),
    external_ids: spotifyExternalIdsSchema,
    popularity: SafeType.Number({ minimum: 0, maximum: 100 }),
} satisfies { [K in keyof TrackObject]-?: TUnsafe<TrackObject[K]> });
