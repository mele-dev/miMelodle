/**
 * Generated by orval v7.1.0 🍺
 * Do not edit manually.
 * Melodle API
 * ---
## Documentation for Melodle's devs.
```(
 AAAAAaaaaaaaa!
              (   ()   )
    ) ________    //  )
 ()  |\       \  //
( \\__ \ ______\//
   \__) |       |
     |  |       |
      \ |       |
       \|_______|
       //    \\
      ((     ||
       \\    ||
     ( ()    ||
      (      () ) )
```
 * OpenAPI spec version: 0.1.0
 */
import { z as zod } from "zod";

/**
 * Route to check whether the service is working.
 * @summary Ping!
 */
export const getResponse = zod.object({
    root: zod.boolean(),
    ping: zod.enum(["Pong!"]),
});

/**
 * @summary Get current state of application.
 */
export const getDebugSnapshotResponseUsersItemNameMax = 40;
export const getDebugSnapshotResponseUsersItemEmailMax = 254;

export const getDebugSnapshotResponseUsersItemEmailRegExp = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
);
export const getDebugSnapshotResponseUsersItemUsernameMin = 3;

export const getDebugSnapshotResponseUsersItemUsernameMax = 30;

export const getDebugSnapshotResponseUsersItemUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);
export const getDebugSnapshotResponseFriendsItemFriendUsernameMin = 3;

export const getDebugSnapshotResponseFriendsItemFriendUsernameMax = 30;

export const getDebugSnapshotResponseFriendsItemFriendUsernameRegExp =
    new RegExp("^[a-zA-Z0-9.-_]+$");
export const getDebugSnapshotResponseFriendsItemUserUsernameMin = 3;

export const getDebugSnapshotResponseFriendsItemUserUsernameMax = 30;

export const getDebugSnapshotResponseFriendsItemUserUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);
export const getDebugSnapshotResponseFriendsItemStatusRegExp = new RegExp(
    "^(pending|blocked|accepted)$"
);

export const getDebugSnapshotResponse = zod.object({
    users: zod.array(
        zod.object({
            name: zod
                .string()
                .min(1)
                .max(getDebugSnapshotResponseUsersItemNameMax),
            email: zod
                .string()
                .max(getDebugSnapshotResponseUsersItemEmailMax)
                .regex(getDebugSnapshotResponseUsersItemEmailRegExp),
            username: zod
                .string()
                .min(getDebugSnapshotResponseUsersItemUsernameMin)
                .max(getDebugSnapshotResponseUsersItemUsernameMax)
                .regex(getDebugSnapshotResponseUsersItemUsernameRegExp),
            profilePictureId: zod.number(),
            spotifyId: zod.string().optional(),
        })
    ),
    friends: zod.array(
        zod.object({
            friendUsername: zod
                .string()
                .min(getDebugSnapshotResponseFriendsItemFriendUsernameMin)
                .max(getDebugSnapshotResponseFriendsItemFriendUsernameMax)
                .regex(getDebugSnapshotResponseFriendsItemFriendUsernameRegExp),
            userUsername: zod
                .string()
                .min(getDebugSnapshotResponseFriendsItemUserUsernameMin)
                .max(getDebugSnapshotResponseFriendsItemUserUsernameMax)
                .regex(getDebugSnapshotResponseFriendsItemUserUsernameRegExp),
            createdAt: zod.string().datetime(),
            status: zod
                .string()
                .regex(getDebugSnapshotResponseFriendsItemStatusRegExp),
        })
    ),
});

/**
 * @summary Reset the application state to a certain snapshot.
 */
export const putDebugSnapshotResponse = zod.enum(["TODO!"]);

/**
 * @summary Get information about an artist
 */
export const getArtistsArtistMusixMatchIdParams = zod.object({
    artistMusixMatchId: zod.string(),
});

export const getArtistsArtistMusixMatchIdResponse = zod.object({
    name: zod.string(),
    musixmatchArtistId: zod.string(),
    imageUrl: zod.string().optional(),
});

/**
 * We use a custom algorithm to determine which artists are most relevant, based off the query in the querystring.
 * @summary Search for available artists.
 */
export const getArtistsSearchQueryQueryMax = 500;

export const getArtistsSearchQueryParams = zod.object({
    query: zod.string().max(getArtistsSearchQueryQueryMax),
});

export const getArtistsSearchResponseItem = zod.object({
    musixmatchArtistId: zod.string(),
    name: zod.string(),
    imageUrl: zod.string().optional(),
});
export const getArtistsSearchResponse = zod.array(getArtistsSearchResponseItem);

/**
 * Get the svg for a certain user icon. The selection of user icons is fixed.
 * @summary Get a user icon.
 */
export const getPublicIconsFilenamePathFilenameRegExp = new RegExp(
    "^(abstract-1\\.svg|abstract-10\\.svg|abstract-11\\.svg|abstract-2\\.svg|abstract-3\\.svg|abstract-4\\.svg|abstract-5\\.svg|abstract-6\\.svg|abstract-7\\.svg|abstract-8\\.svg|abstract-9\\.svg|default\\.svg)$"
);

export const getPublicIconsFilenameParams = zod.object({
    filename: zod.string().regex(getPublicIconsFilenamePathFilenameRegExp),
});

/**
 * @summary Get information about all user icons.
 */
export const getPublicIconsResponseItem = zod.object({
    id: zod.number(),
    filename: zod.string(),
});
export const getPublicIconsResponse = zod.array(getPublicIconsResponseItem);

/**
 * @summary Fetches global leaderboard information.
 */
export const getLeaderboardsQueryGameModesItemRegExp = new RegExp(
    "^(Guess Line|Guess Song)$"
);
export const getLeaderboardsQueryAmountMax = 50;

export const getLeaderboardsQueryParams = zod.object({
    gameModes: zod.array(
        zod.string().regex(getLeaderboardsQueryGameModesItemRegExp)
    ),
    start: zod.number(),
    amount: zod.number().max(getLeaderboardsQueryAmountMax),
});

export const getLeaderboardsResponseLeaderboardItemUsernameMin = 3;

export const getLeaderboardsResponseLeaderboardItemUsernameMax = 30;

export const getLeaderboardsResponseLeaderboardItemUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);
export const getLeaderboardsResponseLeaderboardItemNameMax = 40;

export const getLeaderboardsResponse = zod.object({
    leaderboard: zod.array(
        zod
            .object({
                id: zod.number(),
                username: zod
                    .string()
                    .min(getLeaderboardsResponseLeaderboardItemUsernameMin)
                    .max(getLeaderboardsResponseLeaderboardItemUsernameMax)
                    .regex(
                        getLeaderboardsResponseLeaderboardItemUsernameRegExp
                    ),
                name: zod
                    .string()
                    .min(1)
                    .max(getLeaderboardsResponseLeaderboardItemNameMax),
                profilePictureFilename: zod.string(),
            })
            .and(
                zod.object({
                    score: zod.number(),
                    rank: zod.number(),
                })
            )
    ),
});

/**
 * Authentication is not needed to see public user information.
 * @summary Get public information from some user.
 */
export const getUsersUserIdParams = zod.object({
    userId: zod.number(),
});

export const getUsersUserIdResponseNameMax = 40;
export const getUsersUserIdResponseUsernameMin = 3;

export const getUsersUserIdResponseUsernameMax = 30;

export const getUsersUserIdResponseUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);

export const getUsersUserIdResponse = zod.object({
    name: zod.string().min(1).max(getUsersUserIdResponseNameMax),
    username: zod
        .string()
        .min(getUsersUserIdResponseUsernameMin)
        .max(getUsersUserIdResponseUsernameMax)
        .regex(getUsersUserIdResponseUsernameRegExp),
    profilePictureFilename: zod.string(),
});

/**
 * @summary Search users through their public information.
 */
export const getUsersSearchQueryQueryMin = 3;

export const getUsersSearchQueryQueryMax = 100;

export const getUsersSearchQueryParams = zod.object({
    query: zod
        .string()
        .min(getUsersSearchQueryQueryMin)
        .max(getUsersSearchQueryQueryMax),
});

export const getUsersSearchResponseUsernameMin = 3;

export const getUsersSearchResponseUsernameMax = 30;

export const getUsersSearchResponseUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);
export const getUsersSearchResponseNameMax = 40;

export const getUsersSearchResponseItem = zod.object({
    username: zod
        .string()
        .min(getUsersSearchResponseUsernameMin)
        .max(getUsersSearchResponseUsernameMax)
        .regex(getUsersSearchResponseUsernameRegExp),
    name: zod.string().min(1).max(getUsersSearchResponseNameMax),
    profilePictureFilename: zod.string(),
    id: zod.number(),
});
export const getUsersSearchResponse = zod
    .array(getUsersSearchResponseItem)
    .max(50);

/**
 * Creates a new user with the given credentials if possible.
 * @summary Create a user.
 */
export const postAuthRegisterBodyUsernameMin = 3;

export const postAuthRegisterBodyUsernameMax = 30;

export const postAuthRegisterBodyUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);
export const postAuthRegisterBodyEmailMax = 254;

export const postAuthRegisterBodyEmailRegExp = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
);
export const postAuthRegisterBodyPasswordMin = 3;

export const postAuthRegisterBodyPasswordMax = 20;
export const postAuthRegisterBodyNameMax = 40;

export const postAuthRegisterBody = zod.object({
    username: zod
        .string()
        .min(postAuthRegisterBodyUsernameMin)
        .max(postAuthRegisterBodyUsernameMax)
        .regex(postAuthRegisterBodyUsernameRegExp),
    profilePictureId: zod.number(),
    email: zod
        .string()
        .max(postAuthRegisterBodyEmailMax)
        .regex(postAuthRegisterBodyEmailRegExp),
    password: zod
        .string()
        .min(postAuthRegisterBodyPasswordMin)
        .max(postAuthRegisterBodyPasswordMax),
    name: zod.string().min(1).max(postAuthRegisterBodyNameMax),
});

export const postAuthRegisterResponse = zod.object({
    jwtToken: zod.string(),
    id: zod.number(),
});

/**
 * @summary Fetch a user's jwt token.
 */
export const postAuthLoginBodyEmailMax = 254;

export const postAuthLoginBodyEmailRegExp = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
);
export const postAuthLoginBodyPasswordMin = 3;

export const postAuthLoginBodyPasswordMax = 20;

export const postAuthLoginBody = zod.object({
    email: zod
        .string()
        .max(postAuthLoginBodyEmailMax)
        .regex(postAuthLoginBodyEmailRegExp),
    password: zod
        .string()
        .min(postAuthLoginBodyPasswordMin)
        .max(postAuthLoginBodyPasswordMax),
});

export const postAuthLoginResponse = zod
    .object({
        jwtToken: zod.string(),
    })
    .and(
        zod.object({
            id: zod.number(),
        })
    );

/**
 * @summary We will know what we need here when we get to down to implementation.
 */
export const getAuthLoginSpotifyCallbackResponse = zod.object({
    jwtToken: zod.string(),
    id: zod.number(),
});

/**
 * This is the route that exposes the most information about a user.
 * @summary Get your user information.
 */
export const getUsersSelfSelfIdParams = zod.object({
    selfId: zod.number(),
});

export const getUsersSelfSelfIdResponseUsernameMin = 3;

export const getUsersSelfSelfIdResponseUsernameMax = 30;

export const getUsersSelfSelfIdResponseUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);
export const getUsersSelfSelfIdResponseEmailMax = 254;

export const getUsersSelfSelfIdResponseEmailRegExp = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
);
export const getUsersSelfSelfIdResponseNameMax = 40;

export const getUsersSelfSelfIdResponse = zod.object({
    username: zod
        .string()
        .min(getUsersSelfSelfIdResponseUsernameMin)
        .max(getUsersSelfSelfIdResponseUsernameMax)
        .regex(getUsersSelfSelfIdResponseUsernameRegExp),
    email: zod
        .string()
        .max(getUsersSelfSelfIdResponseEmailMax)
        .regex(getUsersSelfSelfIdResponseEmailRegExp),
    name: zod.string().min(1).max(getUsersSelfSelfIdResponseNameMax),
    id: zod.number(),
    profilePictureFile: zod.string(),
});

/**
 * @summary Update your user information.
 */
export const putUsersSelfSelfIdParams = zod.object({
    selfId: zod.number(),
});

export const putUsersSelfSelfIdBodyUsernameMin = 3;

export const putUsersSelfSelfIdBodyUsernameMax = 30;

export const putUsersSelfSelfIdBodyUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);
export const putUsersSelfSelfIdBodyEmailMax = 254;

export const putUsersSelfSelfIdBodyEmailRegExp = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
);
export const putUsersSelfSelfIdBodyNameMax = 40;
export const putUsersSelfSelfIdBodyPasswordMin = 3;

export const putUsersSelfSelfIdBodyPasswordMax = 20;

export const putUsersSelfSelfIdBody = zod.object({
    username: zod
        .string()
        .min(putUsersSelfSelfIdBodyUsernameMin)
        .max(putUsersSelfSelfIdBodyUsernameMax)
        .regex(putUsersSelfSelfIdBodyUsernameRegExp),
    email: zod
        .string()
        .max(putUsersSelfSelfIdBodyEmailMax)
        .regex(putUsersSelfSelfIdBodyEmailRegExp),
    name: zod.string().min(1).max(putUsersSelfSelfIdBodyNameMax),
    password: zod
        .string()
        .min(putUsersSelfSelfIdBodyPasswordMin)
        .max(putUsersSelfSelfIdBodyPasswordMax),
    profilePictureId: zod.number(),
});

export const putUsersSelfSelfIdResponseUsernameMin = 3;

export const putUsersSelfSelfIdResponseUsernameMax = 30;

export const putUsersSelfSelfIdResponseUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);
export const putUsersSelfSelfIdResponseEmailMax = 254;

export const putUsersSelfSelfIdResponseEmailRegExp = new RegExp(
    "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$"
);
export const putUsersSelfSelfIdResponseNameMax = 40;
export const putUsersSelfSelfIdResponsePasswordMin = 3;

export const putUsersSelfSelfIdResponsePasswordMax = 20;

export const putUsersSelfSelfIdResponse = zod.object({
    username: zod
        .string()
        .min(putUsersSelfSelfIdResponseUsernameMin)
        .max(putUsersSelfSelfIdResponseUsernameMax)
        .regex(putUsersSelfSelfIdResponseUsernameRegExp),
    email: zod
        .string()
        .max(putUsersSelfSelfIdResponseEmailMax)
        .regex(putUsersSelfSelfIdResponseEmailRegExp),
    name: zod.string().min(1).max(putUsersSelfSelfIdResponseNameMax),
    password: zod
        .string()
        .min(putUsersSelfSelfIdResponsePasswordMin)
        .max(putUsersSelfSelfIdResponsePasswordMax),
    profilePictureId: zod.number(),
});

/**
 * The cascading deletion will be more thoroughly implemented once other resources are implemented.
 * @summary Delete your own user and all their associated information.
 */
export const deleteUsersSelfSelfIdParams = zod.object({
    selfId: zod.number(),
});

export const deleteUsersSelfSelfIdResponseUsernameMin = 3;

export const deleteUsersSelfSelfIdResponseUsernameMax = 30;

export const deleteUsersSelfSelfIdResponseUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);

export const deleteUsersSelfSelfIdResponse = zod.object({
    username: zod
        .string()
        .min(deleteUsersSelfSelfIdResponseUsernameMin)
        .max(deleteUsersSelfSelfIdResponseUsernameMax)
        .regex(deleteUsersSelfSelfIdResponseUsernameRegExp),
});

/**
 * @summary Get saved user configurations.
 */
export const getUsersSelfSelfIdConfigsParams = zod.object({
    selfId: zod.number(),
});

export const getUsersSelfSelfIdConfigsResponseModeRegExp = new RegExp(
    "^(Guess Line|Guess Song)$"
);

export const getUsersSelfSelfIdConfigsResponseItem = zod.object({
    id: zod.number(),
    mode: zod.string().regex(getUsersSelfSelfIdConfigsResponseModeRegExp),
    onlyFavoriteArtists: zod.boolean(),
    fromArtists: zod.array(
        zod.object({
            musixmatchArtistId: zod.string(),
        })
    ),
});
export const getUsersSelfSelfIdConfigsResponse = zod.array(
    getUsersSelfSelfIdConfigsResponseItem
);

/**
 * @summary Add a new configuration preset.
 */
export const postUsersSelfSelfIdConfigsParams = zod.object({
    selfId: zod.number(),
});

export const postUsersSelfSelfIdConfigsBodyModeRegExp = new RegExp(
    "^(Guess Line|Guess Song)$"
);

export const postUsersSelfSelfIdConfigsBody = zod.object({
    mode: zod.string().regex(postUsersSelfSelfIdConfigsBodyModeRegExp),
    onlyFavoriteArtists: zod.boolean(),
    fromArtists: zod.array(
        zod.object({
            musixmatchArtistId: zod.string(),
        })
    ),
});

export const postUsersSelfSelfIdConfigsResponseModeRegExp = new RegExp(
    "^(Guess Line|Guess Song)$"
);

export const postUsersSelfSelfIdConfigsResponse = zod.object({
    id: zod.number(),
    mode: zod.string().regex(postUsersSelfSelfIdConfigsResponseModeRegExp),
    onlyFavoriteArtists: zod.boolean(),
    fromArtists: zod.array(
        zod.object({
            musixmatchArtistId: zod.string(),
        })
    ),
});

/**
 * @summary Delete a configuration preset.
 */
export const deleteUsersSelfSelfIdConfigsMelodleConfigIdParams = zod.object({
    selfId: zod.number(),
    melodleConfigId: zod.number(),
});

export const deleteUsersSelfSelfIdConfigsMelodleConfigIdResponseModeRegExp =
    new RegExp("^(Guess Line|Guess Song)$");

export const deleteUsersSelfSelfIdConfigsMelodleConfigIdResponse = zod.object({
    id: zod.number(),
    mode: zod
        .string()
        .regex(deleteUsersSelfSelfIdConfigsMelodleConfigIdResponseModeRegExp),
    onlyFavoriteArtists: zod.boolean(),
    fromArtists: zod.array(
        zod.object({
            musixmatchArtistId: zod.string(),
        })
    ),
});

/**
 * @summary Update a configuration preset.
 */
export const putUsersSelfSelfIdConfigsMelodleConfigIdParams = zod.object({
    selfId: zod.number(),
    melodleConfigId: zod.number(),
});

export const putUsersSelfSelfIdConfigsMelodleConfigIdResponseModeRegExp =
    new RegExp("^(Guess Line|Guess Song)$");

export const putUsersSelfSelfIdConfigsMelodleConfigIdResponse = zod.object({
    id: zod.number(),
    mode: zod
        .string()
        .regex(putUsersSelfSelfIdConfigsMelodleConfigIdResponseModeRegExp),
    onlyFavoriteArtists: zod.boolean(),
    fromArtists: zod.array(
        zod.object({
            musixmatchArtistId: zod.string(),
        })
    ),
});

/**
 * TODO: Discuss whether we should ask for the id or make the frontend fetch the data and pass it to us.
 * @summary Ask for a configuration suggestion based off of the user's spotify information.
 */
export const getUsersSelfSelfIdConfigsSuggestParams = zod.object({
    selfId: zod.number(),
});

export const getUsersSelfSelfIdConfigsSuggestQueryParams = zod.object({
    spotifyId: zod.string(),
});

export const getUsersSelfSelfIdConfigsSuggestResponseModeRegExp = new RegExp(
    "^(Guess Line|Guess Song)$"
);

export const getUsersSelfSelfIdConfigsSuggestResponseItem = zod.object({
    mode: zod
        .string()
        .regex(getUsersSelfSelfIdConfigsSuggestResponseModeRegExp),
    onlyFavoriteArtists: zod.boolean(),
    fromArtists: zod.array(
        zod.object({
            musixmatchArtistId: zod.string(),
        })
    ),
});
export const getUsersSelfSelfIdConfigsSuggestResponse = zod.array(
    getUsersSelfSelfIdConfigsSuggestResponseItem
);

/**
 * @summary Get all friends from a user.
 */
export const getUsersSelfSelfIdFriendsParams = zod.object({
    selfId: zod.number(),
});

export const getUsersSelfSelfIdFriendsResponseNameMax = 40;
export const getUsersSelfSelfIdFriendsResponseUsernameMin = 3;

export const getUsersSelfSelfIdFriendsResponseUsernameMax = 30;

export const getUsersSelfSelfIdFriendsResponseUsernameRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+$"
);

export const getUsersSelfSelfIdFriendsResponseItem = zod.object({
    id: zod.number(),
    name: zod.string().min(1).max(getUsersSelfSelfIdFriendsResponseNameMax),
    username: zod
        .string()
        .min(getUsersSelfSelfIdFriendsResponseUsernameMin)
        .max(getUsersSelfSelfIdFriendsResponseUsernameMax)
        .regex(getUsersSelfSelfIdFriendsResponseUsernameRegExp),
    profilePictureId: zod.number(),
});
export const getUsersSelfSelfIdFriendsResponse = zod.array(
    getUsersSelfSelfIdFriendsResponseItem
);

/**
 * @summary Start a new melodle game.
 */
export const postUsersSelfSelfIdMelodleParams = zod.object({
    selfId: zod.number(),
});

export const postUsersSelfSelfIdMelodleBodyModeRegExp = new RegExp(
    "^(Guess Line|Guess Song)$"
);

export const postUsersSelfSelfIdMelodleBody = zod.object({
    id: zod.number(),
    mode: zod.string().regex(postUsersSelfSelfIdMelodleBodyModeRegExp),
    onlyFavoriteArtists: zod.boolean(),
    fromArtists: zod.array(
        zod.object({
            musixmatchArtistId: zod.string(),
        })
    ),
});

export const postUsersSelfSelfIdMelodleResponseConfigModeRegExp = new RegExp(
    "^(Guess Line|Guess Song)$"
);

export const postUsersSelfSelfIdMelodleResponse = zod.object({
    gameId: zod.number(),
    config: zod.object({
        id: zod.number(),
        mode: zod
            .string()
            .regex(postUsersSelfSelfIdMelodleResponseConfigModeRegExp),
        onlyFavoriteArtists: zod.boolean(),
        fromArtists: zod.array(
            zod.object({
                musixmatchArtistId: zod.string(),
            })
        ),
    }),
});

/**
 * @summary Get a history of your own games.
 */
export const getUsersSelfSelfIdMelodleHistoryParams = zod.object({
    selfId: zod.number(),
});

export const getUsersSelfSelfIdMelodleHistoryResponseAttemptsItemGuessedLineMax = 1000;
export const getUsersSelfSelfIdMelodleHistoryResponseGameModeRegExp =
    new RegExp("^(Guess Line|Guess Song)$");
export const getUsersSelfSelfIdMelodleHistoryResponseConfigModeRegExp =
    new RegExp("^(Guess Line|Guess Song)$");

export const getUsersSelfSelfIdMelodleHistoryResponseItem = zod.object({
    userId: zod.number(),
    gameId: zod.number(),
    attempts: zod
        .array(
            zod.object({
                guessedSongId: zod.string(),
                guessedAt: zod.string().datetime(),
            })
        )
        .or(
            zod.array(
                zod.object({
                    guessedLine: zod
                        .string()
                        .max(
                            getUsersSelfSelfIdMelodleHistoryResponseAttemptsItemGuessedLineMax
                        ),
                    guessedAt: zod.string().datetime(),
                })
            )
        ),
    won: zod.boolean().optional(),
    endingTime: zod.string().datetime().optional(),
    gameMode: zod
        .string()
        .regex(getUsersSelfSelfIdMelodleHistoryResponseGameModeRegExp),
    config: zod.object({
        id: zod.number(),
        mode: zod
            .string()
            .regex(getUsersSelfSelfIdMelodleHistoryResponseConfigModeRegExp),
        onlyFavoriteArtists: zod.boolean(),
        fromArtists: zod.array(
            zod.object({
                musixmatchArtistId: zod.string(),
            })
        ),
    }),
});
export const getUsersSelfSelfIdMelodleHistoryResponse = zod.array(
    getUsersSelfSelfIdMelodleHistoryResponseItem
);

/**
 * @summary Update whether a given artist is within you favorite ones.
 */
export const putUsersSelfSelfIdArtistsArtistMusixMatchIdFavoriteParams =
    zod.object({
        selfId: zod.number(),
        artistMusixMatchId: zod.string(),
    });

export const putUsersSelfSelfIdArtistsArtistMusixMatchIdFavoriteBody =
    zod.object({
        isFavorite: zod.boolean(),
    });

export const putUsersSelfSelfIdArtistsArtistMusixMatchIdFavoriteResponse =
    zod.object({
        isFavorite: zod.boolean(),
    });

/**
 * This does not block them, and if they are blocked it unblocks them. It transforms the friends into a normal stranger.
 * @summary Removes a friend.
 */
export const deleteUsersSelfSelfIdFriendsFriendIdParams = zod.object({
    selfId: zod.number(),
    friendId: zod.number(),
});

export const deleteUsersSelfSelfIdFriendsFriendIdResponseUsernameMin = 3;

export const deleteUsersSelfSelfIdFriendsFriendIdResponseUsernameMax = 30;

export const deleteUsersSelfSelfIdFriendsFriendIdResponseUsernameRegExp =
    new RegExp("^[a-zA-Z0-9.-_]+$");

export const deleteUsersSelfSelfIdFriendsFriendIdResponse = zod.object({
    username: zod
        .string()
        .min(deleteUsersSelfSelfIdFriendsFriendIdResponseUsernameMin)
        .max(deleteUsersSelfSelfIdFriendsFriendIdResponseUsernameMax)
        .regex(deleteUsersSelfSelfIdFriendsFriendIdResponseUsernameRegExp),
});

/**
 * @summary Sends a friend request
 */
export const postUsersSelfSelfIdFriendsFriendIdParams = zod.object({
    selfId: zod.number(),
    friendId: zod.number(),
});

export const postUsersSelfSelfIdFriendsFriendIdResponseUsernameMin = 3;

export const postUsersSelfSelfIdFriendsFriendIdResponseUsernameMax = 30;

export const postUsersSelfSelfIdFriendsFriendIdResponseUsernameRegExp =
    new RegExp("^[a-zA-Z0-9.-_]+$");

export const postUsersSelfSelfIdFriendsFriendIdResponse = zod.object({
    username: zod
        .string()
        .min(postUsersSelfSelfIdFriendsFriendIdResponseUsernameMin)
        .max(postUsersSelfSelfIdFriendsFriendIdResponseUsernameMax)
        .regex(postUsersSelfSelfIdFriendsFriendIdResponseUsernameRegExp),
});

/**
 * ## Rules
- If the user has a friend invite from a user, they can accept it.
- They always can block a user, even if they are not in any sort of relationship.
- If they are the ones who blocked the other user, they can unblock by setting it to accepted.
 * @summary Modifies an existing relationship with another user.
 */
export const putUsersSelfSelfIdFriendsFriendIdParams = zod.object({
    selfId: zod.number(),
    friendId: zod.number(),
});

export const putUsersSelfSelfIdFriendsFriendIdBodyStatusRegExp = new RegExp(
    "^(blocked|accepted)$"
);

export const putUsersSelfSelfIdFriendsFriendIdBody = zod.object({
    status: zod
        .string()
        .regex(putUsersSelfSelfIdFriendsFriendIdBodyStatusRegExp),
});

export const putUsersSelfSelfIdFriendsFriendIdResponseStatusRegExp = new RegExp(
    "^(pending|blocked|accepted)$"
);

export const putUsersSelfSelfIdFriendsFriendIdResponse = zod.object({
    status: zod
        .string()
        .regex(putUsersSelfSelfIdFriendsFriendIdResponseStatusRegExp),
});

/**
 * @summary Gets information about the user's friends leaderboard on the game mode.
 */
export const getUsersSelfSelfIdFriendsLeaderboardsParams = zod.object({
    selfId: zod.number(),
});

export const getUsersSelfSelfIdFriendsLeaderboardsQueryAmountMax = 50;
export const getUsersSelfSelfIdFriendsLeaderboardsQueryGameModesItemRegExp =
    new RegExp("^(Guess Line|Guess Song)$");

export const getUsersSelfSelfIdFriendsLeaderboardsQueryParams = zod.object({
    start: zod.number(),
    amount: zod
        .number()
        .max(getUsersSelfSelfIdFriendsLeaderboardsQueryAmountMax),
    gameModes: zod.array(
        zod
            .string()
            .regex(
                getUsersSelfSelfIdFriendsLeaderboardsQueryGameModesItemRegExp
            )
    ),
});

export const getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameMin = 3;

export const getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameMax = 30;

export const getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameRegExp =
    new RegExp("^[a-zA-Z0-9.-_]+$");
export const getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemNameMax = 40;

export const getUsersSelfSelfIdFriendsLeaderboardsResponse = zod.object({
    leaderboard: zod.array(
        zod
            .object({
                id: zod.number(),
                username: zod
                    .string()
                    .min(
                        getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameMin
                    )
                    .max(
                        getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameMax
                    )
                    .regex(
                        getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameRegExp
                    ),
                name: zod
                    .string()
                    .min(1)
                    .max(
                        getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemNameMax
                    ),
                profilePictureFilename: zod.string(),
            })
            .and(
                zod.object({
                    score: zod.number(),
                    rank: zod.number(),
                })
            )
    ),
});

/**
 * @summary Get information about a melodle game.
 */
export const getUsersSelfSelfIdMelodleGameIdParams = zod.object({
    selfId: zod.number(),
    gameId: zod.number(),
});

export const getUsersSelfSelfIdMelodleGameIdResponseAttemptsItemGuessedLineMax = 1000;
export const getUsersSelfSelfIdMelodleGameIdResponseGameModeRegExp = new RegExp(
    "^(Guess Line|Guess Song)$"
);
export const getUsersSelfSelfIdMelodleGameIdResponseConfigModeRegExp =
    new RegExp("^(Guess Line|Guess Song)$");

export const getUsersSelfSelfIdMelodleGameIdResponse = zod.object({
    userId: zod.number(),
    gameId: zod.number(),
    attempts: zod
        .array(
            zod.object({
                guessedSongId: zod.string(),
                guessedAt: zod.string().datetime(),
            })
        )
        .or(
            zod.array(
                zod.object({
                    guessedLine: zod
                        .string()
                        .max(
                            getUsersSelfSelfIdMelodleGameIdResponseAttemptsItemGuessedLineMax
                        ),
                    guessedAt: zod.string().datetime(),
                })
            )
        ),
    won: zod.boolean().optional(),
    endingTime: zod.string().datetime().optional(),
    gameMode: zod
        .string()
        .regex(getUsersSelfSelfIdMelodleGameIdResponseGameModeRegExp),
    config: zod.object({
        id: zod.number(),
        mode: zod
            .string()
            .regex(getUsersSelfSelfIdMelodleGameIdResponseConfigModeRegExp),
        onlyFavoriteArtists: zod.boolean(),
        fromArtists: zod.array(
            zod.object({
                musixmatchArtistId: zod.string(),
            })
        ),
    }),
});

/**
 * @summary Submit a guess for a melodle game.
 */
export const postUsersSelfSelfIdMelodleGameIdGuessLineAttemptsParams =
    zod.object({
        selfId: zod.number(),
        gameId: zod.number(),
    });

export const postUsersSelfSelfIdMelodleGameIdGuessLineAttemptsBodyGuessedLineMax = 1000;

export const postUsersSelfSelfIdMelodleGameIdGuessLineAttemptsBody = zod.object(
    {
        guessedLine: zod
            .string()
            .max(
                postUsersSelfSelfIdMelodleGameIdGuessLineAttemptsBodyGuessedLineMax
            ),
    }
);

export const postUsersSelfSelfIdMelodleGameIdGuessLineAttemptsResponseGuessLineHintsItemRegExp =
    new RegExp("^(Correct spot|Correct letter, wrong spot\\.|Wrong)$");

export const postUsersSelfSelfIdMelodleGameIdGuessLineAttemptsResponse =
    zod.object({
        guessLineHints: zod.array(
            zod
                .string()
                .regex(
                    postUsersSelfSelfIdMelodleGameIdGuessLineAttemptsResponseGuessLineHintsItemRegExp
                )
        ),
        input: zod.string(),
        won: zod.boolean(),
    });

/**
 * @summary Submit a guess for a melodle game.
 */
export const postUsersSelfSelfIdMelodleGameIdGuessSongAttemptsParams =
    zod.object({
        selfId: zod.number(),
        gameId: zod.number(),
    });

export const postUsersSelfSelfIdMelodleGameIdGuessSongAttemptsBody = zod.object(
    {
        guessedSongId: zod.string(),
    }
);

export const postUsersSelfSelfIdMelodleGameIdGuessSongAttemptsResponse =
    zod.object({
        correctArtist: zod.boolean(),
        correctBand: zod.boolean(),
        correctAlbum: zod.boolean(),
        won: zod.boolean(),
    });
