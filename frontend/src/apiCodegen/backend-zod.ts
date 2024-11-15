/**
 * Generated by orval v7.2.0 🍺
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
import {
  z as zod
} from 'zod'


/**
 * Route to check whether the service is working.
 * @summary Ping!
 */
export const getResponse = zod.object({
  "root": zod.boolean(),
  "ping": zod.enum(['Pong!'])
})


/**
 * @summary Get information about an artist
 */
export const getArtistsArtistMusixMatchIdParams = zod.object({
  "artistMusixMatchId": zod.number()
})

export const getArtistsArtistMusixMatchIdResponseRestrictedMin = 0;

export const getArtistsArtistMusixMatchIdResponseRestrictedMax = 1;
export const getArtistsArtistMusixMatchIdResponseManagedMin = 0;

export const getArtistsArtistMusixMatchIdResponseManagedMax = 1;


export const getArtistsArtistMusixMatchIdResponse = zod.object({
  "artist_id": zod.number(),
  "artist_fq_id": zod.string().optional(),
  "artist_mbid": zod.string().optional(),
  "artist_name": zod.string(),
  "artist_name_translation_list": zod.any(),
  "artist_comment": zod.string(),
  "artist_country": zod.string(),
  "artist_alias_list": zod.array(zod.object({
  "artist_alias": zod.string()
})),
  "artist_rating": zod.number(),
  "artist_twitter_url": zod.string().optional(),
  "artist_website_url": zod.string().optional(),
  "artist_tiktok_url": zod.string().optional(),
  "artist_facebook_url": zod.string().optional(),
  "artist_youtube_url": zod.string().optional(),
  "artist_vanity_url": zod.string().optional(),
  "artist_edit_url": zod.string().optional(),
  "artist_share_url": zod.string().optional(),
  "restricted": zod.number().min(getArtistsArtistMusixMatchIdResponseRestrictedMin).max(getArtistsArtistMusixMatchIdResponseRestrictedMax).optional(),
  "managed": zod.number().min(getArtistsArtistMusixMatchIdResponseManagedMin).max(getArtistsArtistMusixMatchIdResponseManagedMax).optional(),
  "updated_time": zod.string().datetime(),
  "externals_ids": zod.object({
  "spotify": zod.array(zod.string()).optional(),
  "itunes": zod.array(zod.string()).optional(),
  "amazon_music": zod.array(zod.string()).optional()
}).optional(),
  "begin_date_year": zod.string(),
  "begin_date": zod.string(),
  "end_date_year": zod.string(),
  "end_date": zod.string(),
  "primary_genres": zod.object({
  "music_genre_list": zod.array(zod.object({
  "music_genre": zod.object({
  "music_genre_id": zod.number(),
  "music_genre_parent_id": zod.number(),
  "music_genre_name": zod.string(),
  "music_genre_name_extended": zod.string(),
  "music_genre_vanity": zod.string().or(zod.null())
})
}))
}).optional(),
  "secondary_genres": zod.object({
  "music_genre_list": zod.array(zod.object({
  "music_genre": zod.object({
  "music_genre_id": zod.number(),
  "music_genre_parent_id": zod.number(),
  "music_genre_name": zod.string(),
  "music_genre_name_extended": zod.string(),
  "music_genre_vanity": zod.string().or(zod.null())
})
}))
}).optional(),
  "artist_credits": zod.any()
})


/**
 * Search for artists based on the query provided in the querystring.
 * @summary Search for artists by name
 */
export const getArtistsArtistNameQueryQueryMax = 200;


export const getArtistsArtistNameQueryParams = zod.object({
  "query": zod.string().max(getArtistsArtistNameQueryQueryMax)
})

export const getArtistsArtistNameResponseRestrictedMin = 0;

export const getArtistsArtistNameResponseRestrictedMax = 1;
export const getArtistsArtistNameResponseManagedMin = 0;

export const getArtistsArtistNameResponseManagedMax = 1;


export const getArtistsArtistNameResponseItem = zod.object({
  "artist_id": zod.number(),
  "artist_fq_id": zod.string().optional(),
  "artist_mbid": zod.string().optional(),
  "artist_name": zod.string(),
  "artist_name_translation_list": zod.any(),
  "artist_comment": zod.string(),
  "artist_country": zod.string(),
  "artist_alias_list": zod.array(zod.object({
  "artist_alias": zod.string()
})),
  "artist_rating": zod.number(),
  "artist_twitter_url": zod.string().optional(),
  "artist_website_url": zod.string().optional(),
  "artist_tiktok_url": zod.string().optional(),
  "artist_facebook_url": zod.string().optional(),
  "artist_youtube_url": zod.string().optional(),
  "artist_vanity_url": zod.string().optional(),
  "artist_edit_url": zod.string().optional(),
  "artist_share_url": zod.string().optional(),
  "restricted": zod.number().min(getArtistsArtistNameResponseRestrictedMin).max(getArtistsArtistNameResponseRestrictedMax).optional(),
  "managed": zod.number().min(getArtistsArtistNameResponseManagedMin).max(getArtistsArtistNameResponseManagedMax).optional(),
  "updated_time": zod.string().datetime(),
  "externals_ids": zod.object({
  "spotify": zod.array(zod.string()).optional(),
  "itunes": zod.array(zod.string()).optional(),
  "amazon_music": zod.array(zod.string()).optional()
}).optional(),
  "begin_date_year": zod.string(),
  "begin_date": zod.string(),
  "end_date_year": zod.string(),
  "end_date": zod.string(),
  "primary_genres": zod.object({
  "music_genre_list": zod.array(zod.object({
  "music_genre": zod.object({
  "music_genre_id": zod.number(),
  "music_genre_parent_id": zod.number(),
  "music_genre_name": zod.string(),
  "music_genre_name_extended": zod.string(),
  "music_genre_vanity": zod.string().or(zod.null())
})
}))
}).optional(),
  "secondary_genres": zod.object({
  "music_genre_list": zod.array(zod.object({
  "music_genre": zod.object({
  "music_genre_id": zod.number(),
  "music_genre_parent_id": zod.number(),
  "music_genre_name": zod.string(),
  "music_genre_name_extended": zod.string(),
  "music_genre_vanity": zod.string().or(zod.null())
})
}))
}).optional(),
  "artist_credits": zod.any()
})
export const getArtistsArtistNameResponse = zod.array(getArtistsArtistNameResponseItem)


/**
 * @summary Get current state of application.
 */
export const getDebugSnapshotResponseUsersItemNameMax = 25;
export const getDebugSnapshotResponseUsersItemEmailMax = 254;

export const getDebugSnapshotResponseUsersItemEmailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
export const getDebugSnapshotResponseUsersItemUsernameMin = 3;

export const getDebugSnapshotResponseUsersItemUsernameMax = 50;

export const getDebugSnapshotResponseUsersItemUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const getDebugSnapshotResponseFriendsItemFriendUsernameMin = 3;

export const getDebugSnapshotResponseFriendsItemFriendUsernameMax = 50;

export const getDebugSnapshotResponseFriendsItemFriendUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const getDebugSnapshotResponseFriendsItemUserUsernameMin = 3;

export const getDebugSnapshotResponseFriendsItemUserUsernameMax = 50;

export const getDebugSnapshotResponseFriendsItemUserUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const getDebugSnapshotResponseFriendsItemStatusRegExp = new RegExp('^(pending|blocked|accepted)$');


export const getDebugSnapshotResponse = zod.object({
  "users": zod.array(zod.object({
  "name": zod.string().min(1).max(getDebugSnapshotResponseUsersItemNameMax),
  "email": zod.string().max(getDebugSnapshotResponseUsersItemEmailMax).regex(getDebugSnapshotResponseUsersItemEmailRegExp),
  "username": zod.string().min(getDebugSnapshotResponseUsersItemUsernameMin).max(getDebugSnapshotResponseUsersItemUsernameMax).regex(getDebugSnapshotResponseUsersItemUsernameRegExp),
  "profilePictureId": zod.number(),
  "spotifyId": zod.string().optional()
})),
  "friends": zod.array(zod.object({
  "friendUsername": zod.string().min(getDebugSnapshotResponseFriendsItemFriendUsernameMin).max(getDebugSnapshotResponseFriendsItemFriendUsernameMax).regex(getDebugSnapshotResponseFriendsItemFriendUsernameRegExp),
  "userUsername": zod.string().min(getDebugSnapshotResponseFriendsItemUserUsernameMin).max(getDebugSnapshotResponseFriendsItemUserUsernameMax).regex(getDebugSnapshotResponseFriendsItemUserUsernameRegExp),
  "createdAt": zod.string().datetime(),
  "status": zod.string().regex(getDebugSnapshotResponseFriendsItemStatusRegExp)
}))
})


/**
 * @summary Reset the application state to a certain snapshot.
 */
export const putDebugSnapshotResponse = zod.enum(['TODO!'])


/**
 * @summary Fetches global leaderboard information.
 */
export const getLeaderboardsQueryGameModesItemRegExp = new RegExp('^(Guess Line|Guess Song)$');
export const getLeaderboardsQueryAmountMax = 50;


export const getLeaderboardsQueryParams = zod.object({
  "gameModes": zod.array(zod.string().regex(getLeaderboardsQueryGameModesItemRegExp)),
  "start": zod.number(),
  "amount": zod.number().max(getLeaderboardsQueryAmountMax)
})

export const getLeaderboardsResponseLeaderboardItemUsernameMin = 3;

export const getLeaderboardsResponseLeaderboardItemUsernameMax = 50;

export const getLeaderboardsResponseLeaderboardItemUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const getLeaderboardsResponseLeaderboardItemNameMax = 25;


export const getLeaderboardsResponse = zod.object({
  "leaderboard": zod.array(zod.object({
  "id": zod.number(),
  "username": zod.string().min(getLeaderboardsResponseLeaderboardItemUsernameMin).max(getLeaderboardsResponseLeaderboardItemUsernameMax).regex(getLeaderboardsResponseLeaderboardItemUsernameRegExp),
  "name": zod.string().min(1).max(getLeaderboardsResponseLeaderboardItemNameMax),
  "profilePictureFilename": zod.string()
}).and(zod.object({
  "score": zod.number(),
  "rank": zod.number()
})))
})


/**
 * This endpoint retrieves the lyrics for a given track using its Musixmatch ID
 * @summary Get lyrics for a specific track
 */
export const getLyricsTrackMusixMatchIdParams = zod.object({
  "trackMusixMatchId": zod.number()
})

export const getLyricsTrackMusixMatchIdResponse = zod.object({
  "lyricsId": zod.string(),
  "trackId": zod.string(),
  "lyricsBody": zod.string(),
  "explicit": zod.boolean(),
  "language": zod.string(),
  "copyright": zod.string().optional()
})


/**
 * Get the svg for a certain user icon. The selection of user icons is fixed.
 * @summary Get a user icon.
 */
export const getPublicIconsFilenamePathFilenameRegExp = new RegExp('^(abstract-1\\.svg|abstract-10\\.svg|abstract-11\\.svg|abstract-2\\.svg|abstract-3\\.svg|abstract-4\\.svg|abstract-5\\.svg|abstract-6\\.svg|abstract-7\\.svg|abstract-8\\.svg|abstract-9\\.svg|default\\.svg)$');


export const getPublicIconsFilenameParams = zod.object({
  "filename": zod.string().regex(getPublicIconsFilenamePathFilenameRegExp)
})


/**
 * @summary Get information about all user icons.
 */
export const getPublicIconsResponseItem = zod.object({
  "id": zod.number(),
  "filename": zod.string()
})
export const getPublicIconsResponse = zod.array(getPublicIconsResponseItem)


/**
 * Authentication is not needed to see public user information.
 * @summary Get public information from some user.
 */
export const getUsersUserIdParams = zod.object({
  "userId": zod.number()
})

export const getUsersUserIdResponseNameMax = 25;
export const getUsersUserIdResponseUsernameMin = 3;

export const getUsersUserIdResponseUsernameMax = 50;

export const getUsersUserIdResponseUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');


export const getUsersUserIdResponse = zod.object({
  "name": zod.string().min(1).max(getUsersUserIdResponseNameMax),
  "username": zod.string().min(getUsersUserIdResponseUsernameMin).max(getUsersUserIdResponseUsernameMax).regex(getUsersUserIdResponseUsernameRegExp),
  "profilePictureFilename": zod.string()
})


/**
 * @summary Search users through their public information.
 */
export const getUsersSearchQueryQueryMin = 3;

export const getUsersSearchQueryQueryMax = 100;
export const getUsersSearchQueryPageSizeMax = 50;


export const getUsersSearchQueryParams = zod.object({
  "query": zod.string().min(getUsersSearchQueryQueryMin).max(getUsersSearchQueryQueryMax),
  "pageSize": zod.number().min(1).max(getUsersSearchQueryPageSizeMax),
  "page": zod.number()
})

export const getUsersSearchResponseMatchesItemUsernameMin = 3;

export const getUsersSearchResponseMatchesItemUsernameMax = 50;

export const getUsersSearchResponseMatchesItemUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const getUsersSearchResponseMatchesItemNameMax = 25;


export const getUsersSearchResponse = zod.object({
  "matches": zod.array(zod.object({
  "username": zod.string().min(getUsersSearchResponseMatchesItemUsernameMin).max(getUsersSearchResponseMatchesItemUsernameMax).regex(getUsersSearchResponseMatchesItemUsernameRegExp),
  "name": zod.string().min(1).max(getUsersSearchResponseMatchesItemNameMax),
  "profilePictureFilename": zod.string(),
  "id": zod.number(),
  "profilePictureId": zod.number(),
  "rank": zod.number()
})),
  "totalPages": zod.number()
})


/**
 * @summary Check if some user data already exists
 */
export const getUsersCheckQueryUsernameMin = 3;

export const getUsersCheckQueryUsernameMax = 50;

export const getUsersCheckQueryUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const getUsersCheckQueryEmailMax = 254;

export const getUsersCheckQueryEmailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');


export const getUsersCheckQueryParams = zod.object({
  "username": zod.string().min(getUsersCheckQueryUsernameMin).max(getUsersCheckQueryUsernameMax).regex(getUsersCheckQueryUsernameRegExp).optional(),
  "email": zod.string().max(getUsersCheckQueryEmailMax).regex(getUsersCheckQueryEmailRegExp).optional()
})

export const getUsersCheckResponse = zod.object({
  "usernameExists": zod.boolean(),
  "emailExists": zod.boolean()
})


/**
 * @summary Fetch a user's jwt token.
 */
export const postAuthLoginBodyPasswordMin = 3;

export const postAuthLoginBodyPasswordMax = 20;
export const postAuthLoginBodyEmailOrUsernameMax = 254;


export const postAuthLoginBody = zod.object({
  "password": zod.string().min(postAuthLoginBodyPasswordMin).max(postAuthLoginBodyPasswordMax),
  "emailOrUsername": zod.string().max(postAuthLoginBodyEmailOrUsernameMax)
})

export const postAuthLoginResponse = zod.object({
  "jwtToken": zod.string(),
  "id": zod.number()
})


/**
 * Creates a new user with the given credentials if possible.
 * @summary Create a user.
 */
export const postAuthRegisterBodyUsernameMin = 3;

export const postAuthRegisterBodyUsernameMax = 50;

export const postAuthRegisterBodyUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const postAuthRegisterBodyEmailMax = 254;

export const postAuthRegisterBodyEmailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
export const postAuthRegisterBodyPasswordMin = 3;

export const postAuthRegisterBodyPasswordMax = 20;
export const postAuthRegisterBodyNameMax = 25;


export const postAuthRegisterBody = zod.object({
  "username": zod.string().min(postAuthRegisterBodyUsernameMin).max(postAuthRegisterBodyUsernameMax).regex(postAuthRegisterBodyUsernameRegExp),
  "profilePictureId": zod.number(),
  "email": zod.string().max(postAuthRegisterBodyEmailMax).regex(postAuthRegisterBodyEmailRegExp),
  "password": zod.string().min(postAuthRegisterBodyPasswordMin).max(postAuthRegisterBodyPasswordMax),
  "name": zod.string().min(1).max(postAuthRegisterBodyNameMax)
})

export const postAuthRegisterResponse = zod.object({
  "jwtToken": zod.string(),
  "id": zod.number()
})


/**
 * All fake users have Fake123! as their password.
 * @summary Returns random, believable credentials for a user.
 */
export const getDebugFakeUserResponseNameMax = 25;
export const getDebugFakeUserResponseEmailMax = 254;

export const getDebugFakeUserResponseEmailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
export const getDebugFakeUserResponseUsernameMin = 3;

export const getDebugFakeUserResponseUsernameMax = 50;

export const getDebugFakeUserResponseUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const getDebugFakeUserResponsePasswordMin = 3;

export const getDebugFakeUserResponsePasswordMax = 20;


export const getDebugFakeUserResponse = zod.object({
  "name": zod.string().min(1).max(getDebugFakeUserResponseNameMax),
  "email": zod.string().max(getDebugFakeUserResponseEmailMax).regex(getDebugFakeUserResponseEmailRegExp),
  "username": zod.string().min(getDebugFakeUserResponseUsernameMin).max(getDebugFakeUserResponseUsernameMax).regex(getDebugFakeUserResponseUsernameRegExp),
  "password": zod.string().min(getDebugFakeUserResponsePasswordMin).max(getDebugFakeUserResponsePasswordMax),
  "profilePictureId": zod.number()
})


/**
 * We do not check if the user already exists, so this route may error. On error, we roll back any changes.
 * @summary Create a certain number of fake users.
 */
export const postDebugFakeUsersBody = zod.object({
  "amount": zod.number()
})


/**
 * @summary Query information from spotify.
 */
export const getSpotifySearchQueryPageSizeMax = 50;
export const getSpotifySearchQueryQueryMin = 3;

export const getSpotifySearchQueryQueryMax = 100;
export const getSpotifySearchQuerySpotifyQueryTypeItemRegExp = new RegExp('^(artist|track|album|playlist|show|episode|audiobook)$');


export const getSpotifySearchQueryParams = zod.object({
  "page": zod.number(),
  "pageSize": zod.number().min(1).max(getSpotifySearchQueryPageSizeMax),
  "query": zod.string().min(getSpotifySearchQueryQueryMin).max(getSpotifySearchQueryQueryMax),
  "spotifyQueryType": zod.array(zod.string().regex(getSpotifySearchQuerySpotifyQueryTypeItemRegExp))
})

export const getSpotifySearchResponse = zod.object({
  "artists": zod.object({
  "limit": zod.number(),
  "href": zod.string(),
  "next": zod.string().or(zod.null()),
  "previous": zod.string().or(zod.null()),
  "total": zod.number(),
  "offset": zod.number(),
  "items": zod.array(zod.object({
  "name": zod.string(),
  "spotifyArtistId": zod.string(),
  "genres": zod.array(zod.string()),
  "followers": zod.object({
  "href": zod.string().or(zod.null()),
  "total": zod.number()
}),
  "popularity": zod.number(),
  "images": zod.array(zod.object({
  "url": zod.string(),
  "width": zod.number().or(zod.null()),
  "height": zod.number().or(zod.null())
})),
  "externalUrls": zod.object({
  "spotify": zod.string()
})
}))
}).optional()
})


/**
 * This is the route that exposes the most information about a user.
 * @summary Get your user information.
 */
export const getUsersSelfSelfIdParams = zod.object({
  "selfId": zod.number()
})

export const getUsersSelfSelfIdResponseUsernameMin = 3;

export const getUsersSelfSelfIdResponseUsernameMax = 50;

export const getUsersSelfSelfIdResponseUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const getUsersSelfSelfIdResponseEmailMax = 254;

export const getUsersSelfSelfIdResponseEmailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
export const getUsersSelfSelfIdResponseNameMax = 25;


export const getUsersSelfSelfIdResponse = zod.object({
  "username": zod.string().min(getUsersSelfSelfIdResponseUsernameMin).max(getUsersSelfSelfIdResponseUsernameMax).regex(getUsersSelfSelfIdResponseUsernameRegExp),
  "email": zod.string().max(getUsersSelfSelfIdResponseEmailMax).regex(getUsersSelfSelfIdResponseEmailRegExp),
  "name": zod.string().min(1).max(getUsersSelfSelfIdResponseNameMax),
  "id": zod.number(),
  "profilePictureFile": zod.string(),
  "profilePictureId": zod.number()
})


/**
 * @summary Update your user information.
 */
export const putUsersSelfSelfIdParams = zod.object({
  "selfId": zod.number()
})

export const putUsersSelfSelfIdBodyUsernameMin = 3;

export const putUsersSelfSelfIdBodyUsernameMax = 50;

export const putUsersSelfSelfIdBodyUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const putUsersSelfSelfIdBodyEmailMax = 254;

export const putUsersSelfSelfIdBodyEmailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
export const putUsersSelfSelfIdBodyNameMax = 25;
export const putUsersSelfSelfIdBodyPasswordMin = 3;

export const putUsersSelfSelfIdBodyPasswordMax = 20;
export const putUsersSelfSelfIdBodyOldPasswordMin = 3;

export const putUsersSelfSelfIdBodyOldPasswordMax = 20;


export const putUsersSelfSelfIdBody = zod.object({
  "username": zod.string().min(putUsersSelfSelfIdBodyUsernameMin).max(putUsersSelfSelfIdBodyUsernameMax).regex(putUsersSelfSelfIdBodyUsernameRegExp),
  "email": zod.string().max(putUsersSelfSelfIdBodyEmailMax).regex(putUsersSelfSelfIdBodyEmailRegExp),
  "name": zod.string().min(1).max(putUsersSelfSelfIdBodyNameMax),
  "password": zod.string().min(putUsersSelfSelfIdBodyPasswordMin).max(putUsersSelfSelfIdBodyPasswordMax),
  "oldPassword": zod.string().min(putUsersSelfSelfIdBodyOldPasswordMin).max(putUsersSelfSelfIdBodyOldPasswordMax),
  "profilePictureId": zod.number()
})

export const putUsersSelfSelfIdResponseUsernameMin = 3;

export const putUsersSelfSelfIdResponseUsernameMax = 50;

export const putUsersSelfSelfIdResponseUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const putUsersSelfSelfIdResponseEmailMax = 254;

export const putUsersSelfSelfIdResponseEmailRegExp = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$');
export const putUsersSelfSelfIdResponseNameMax = 25;
export const putUsersSelfSelfIdResponsePasswordMin = 3;

export const putUsersSelfSelfIdResponsePasswordMax = 20;


export const putUsersSelfSelfIdResponse = zod.object({
  "username": zod.string().min(putUsersSelfSelfIdResponseUsernameMin).max(putUsersSelfSelfIdResponseUsernameMax).regex(putUsersSelfSelfIdResponseUsernameRegExp),
  "email": zod.string().max(putUsersSelfSelfIdResponseEmailMax).regex(putUsersSelfSelfIdResponseEmailRegExp),
  "name": zod.string().min(1).max(putUsersSelfSelfIdResponseNameMax),
  "password": zod.string().min(putUsersSelfSelfIdResponsePasswordMin).max(putUsersSelfSelfIdResponsePasswordMax),
  "profilePictureId": zod.number()
})


/**
 * The cascading deletion will be more thoroughly implemented once other resources are implemented.
 * @summary Delete your own user and all their associated information.
 */
export const deleteUsersSelfSelfIdParams = zod.object({
  "selfId": zod.number()
})

export const deleteUsersSelfSelfIdResponseUsernameMin = 3;

export const deleteUsersSelfSelfIdResponseUsernameMax = 50;

export const deleteUsersSelfSelfIdResponseUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');


export const deleteUsersSelfSelfIdResponse = zod.object({
  "username": zod.string().min(deleteUsersSelfSelfIdResponseUsernameMin).max(deleteUsersSelfSelfIdResponseUsernameMax).regex(deleteUsersSelfSelfIdResponseUsernameRegExp)
})


/**
 * @summary Get every user currently blocked by self.
 */
export const getUsersSelfSelfIdBlockingParams = zod.object({
  "selfId": zod.number()
})

export const getUsersSelfSelfIdBlockingResponseNameMax = 25;
export const getUsersSelfSelfIdBlockingResponseUsernameMin = 3;

export const getUsersSelfSelfIdBlockingResponseUsernameMax = 50;

export const getUsersSelfSelfIdBlockingResponseUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');


export const getUsersSelfSelfIdBlockingResponseItem = zod.object({
  "id": zod.number(),
  "name": zod.string().min(1).max(getUsersSelfSelfIdBlockingResponseNameMax),
  "username": zod.string().min(getUsersSelfSelfIdBlockingResponseUsernameMin).max(getUsersSelfSelfIdBlockingResponseUsernameMax).regex(getUsersSelfSelfIdBlockingResponseUsernameRegExp),
  "profilePictureId": zod.number(),
  "profilePictureFilename": zod.string()
})
export const getUsersSelfSelfIdBlockingResponse = zod.array(getUsersSelfSelfIdBlockingResponseItem)


/**
 * @summary Get saved user configurations.
 */
export const getUsersSelfSelfIdConfigsParams = zod.object({
  "selfId": zod.number()
})

export const getUsersSelfSelfIdConfigsResponseModeRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const getUsersSelfSelfIdConfigsResponseItem = zod.object({
  "id": zod.number(),
  "mode": zod.string().regex(getUsersSelfSelfIdConfigsResponseModeRegExp),
  "onlyFavoriteArtists": zod.boolean(),
  "fromArtists": zod.array(zod.string())
})
export const getUsersSelfSelfIdConfigsResponse = zod.array(getUsersSelfSelfIdConfigsResponseItem)


/**
 * @summary Add a new configuration preset.
 */
export const postUsersSelfSelfIdConfigsParams = zod.object({
  "selfId": zod.number()
})

export const postUsersSelfSelfIdConfigsBodyModeRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const postUsersSelfSelfIdConfigsBody = zod.object({
  "mode": zod.string().regex(postUsersSelfSelfIdConfigsBodyModeRegExp),
  "onlyFavoriteArtists": zod.boolean(),
  "fromArtists": zod.array(zod.string())
})

export const postUsersSelfSelfIdConfigsResponseModeRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const postUsersSelfSelfIdConfigsResponse = zod.object({
  "id": zod.number(),
  "mode": zod.string().regex(postUsersSelfSelfIdConfigsResponseModeRegExp),
  "onlyFavoriteArtists": zod.boolean(),
  "fromArtists": zod.array(zod.string())
})


/**
 * @summary Delete a configuration preset.
 */
export const deleteUsersSelfSelfIdConfigsMelodleConfigIdParams = zod.object({
  "selfId": zod.number(),
  "melodleConfigId": zod.number()
})

export const deleteUsersSelfSelfIdConfigsMelodleConfigIdResponseModeRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const deleteUsersSelfSelfIdConfigsMelodleConfigIdResponse = zod.object({
  "id": zod.number(),
  "mode": zod.string().regex(deleteUsersSelfSelfIdConfigsMelodleConfigIdResponseModeRegExp),
  "onlyFavoriteArtists": zod.boolean(),
  "fromArtists": zod.array(zod.string())
})


/**
 * @summary Update a configuration preset.
 */
export const putUsersSelfSelfIdConfigsMelodleConfigIdParams = zod.object({
  "selfId": zod.number(),
  "melodleConfigId": zod.number()
})

export const putUsersSelfSelfIdConfigsMelodleConfigIdResponseModeRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const putUsersSelfSelfIdConfigsMelodleConfigIdResponse = zod.object({
  "id": zod.number(),
  "mode": zod.string().regex(putUsersSelfSelfIdConfigsMelodleConfigIdResponseModeRegExp),
  "onlyFavoriteArtists": zod.boolean(),
  "fromArtists": zod.array(zod.string())
})


/**
 * TODO: Discuss whether we should ask for the id or make the frontend fetch the data and pass it to us.
 * @summary Ask for a configuration suggestion based off of the user's spotify information.
 */
export const getUsersSelfSelfIdConfigsSuggestParams = zod.object({
  "selfId": zod.number()
})

export const getUsersSelfSelfIdConfigsSuggestQueryParams = zod.object({
  "spotifyId": zod.string()
})

export const getUsersSelfSelfIdConfigsSuggestResponseModeRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const getUsersSelfSelfIdConfigsSuggestResponseItem = zod.object({
  "mode": zod.string().regex(getUsersSelfSelfIdConfigsSuggestResponseModeRegExp),
  "onlyFavoriteArtists": zod.boolean(),
  "fromArtists": zod.array(zod.string())
})
export const getUsersSelfSelfIdConfigsSuggestResponse = zod.array(getUsersSelfSelfIdConfigsSuggestResponseItem)


/**
 * @summary Get all friends from a user.
 */
export const getUsersSelfSelfIdFriendsParams = zod.object({
  "selfId": zod.number()
})

export const getUsersSelfSelfIdFriendsResponseNameMax = 25;
export const getUsersSelfSelfIdFriendsResponseUsernameMin = 3;

export const getUsersSelfSelfIdFriendsResponseUsernameMax = 50;

export const getUsersSelfSelfIdFriendsResponseUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const getUsersSelfSelfIdFriendsResponseStatusRegExp = new RegExp('^(pending|blocked|accepted)$');


export const getUsersSelfSelfIdFriendsResponseItem = zod.object({
  "id": zod.number(),
  "name": zod.string().min(1).max(getUsersSelfSelfIdFriendsResponseNameMax),
  "username": zod.string().min(getUsersSelfSelfIdFriendsResponseUsernameMin).max(getUsersSelfSelfIdFriendsResponseUsernameMax).regex(getUsersSelfSelfIdFriendsResponseUsernameRegExp),
  "profilePictureId": zod.number(),
  "profilePictureFilename": zod.string(),
  "status": zod.string().regex(getUsersSelfSelfIdFriendsResponseStatusRegExp),
  "selfIsRequestSender": zod.boolean()
})
export const getUsersSelfSelfIdFriendsResponse = zod.array(getUsersSelfSelfIdFriendsResponseItem)


/**
 * @summary Start a new melodle game.
 */
export const postUsersSelfSelfIdGameParams = zod.object({
  "selfId": zod.number()
})

export const postUsersSelfSelfIdGameBodyModeRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const postUsersSelfSelfIdGameBody = zod.object({
  "id": zod.number(),
  "mode": zod.string().regex(postUsersSelfSelfIdGameBodyModeRegExp),
  "onlyFavoriteArtists": zod.boolean(),
  "fromArtists": zod.array(zod.string())
})

export const postUsersSelfSelfIdGameResponseConfigModeRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const postUsersSelfSelfIdGameResponse = zod.object({
  "gameId": zod.number(),
  "config": zod.object({
  "id": zod.number(),
  "mode": zod.string().regex(postUsersSelfSelfIdGameResponseConfigModeRegExp),
  "onlyFavoriteArtists": zod.boolean(),
  "fromArtists": zod.array(zod.string())
})
})


/**
 * @summary Get a history of your own games.
 */
export const getUsersSelfSelfIdGameHistoryParams = zod.object({
  "selfId": zod.number()
})

export const getUsersSelfSelfIdGameHistoryResponseAttemptsItemGuessedLineMax = 1000;
export const getUsersSelfSelfIdGameHistoryResponseGameModeRegExp = new RegExp('^(Guess Line|Guess Song)$');
export const getUsersSelfSelfIdGameHistoryResponseConfigModeRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const getUsersSelfSelfIdGameHistoryResponseItem = zod.object({
  "userId": zod.number(),
  "gameId": zod.number(),
  "attempts": zod.array(zod.object({
  "guessedSongId": zod.string(),
  "guessedAt": zod.string().datetime()
})).or(zod.array(zod.object({
  "guessedLine": zod.string().max(getUsersSelfSelfIdGameHistoryResponseAttemptsItemGuessedLineMax),
  "guessedAt": zod.string().datetime()
}))),
  "won": zod.boolean().optional(),
  "endingTime": zod.string().datetime().optional(),
  "gameMode": zod.string().regex(getUsersSelfSelfIdGameHistoryResponseGameModeRegExp),
  "config": zod.object({
  "id": zod.number(),
  "mode": zod.string().regex(getUsersSelfSelfIdGameHistoryResponseConfigModeRegExp),
  "onlyFavoriteArtists": zod.boolean(),
  "fromArtists": zod.array(zod.string())
})
})
export const getUsersSelfSelfIdGameHistoryResponse = zod.array(getUsersSelfSelfIdGameHistoryResponseItem)


/**
 * @summary Update whether a given artist is within you favorite ones.
 */
export const putUsersSelfSelfIdArtistsArtistMusixMatchIdFavoriteParams = zod.object({
  "selfId": zod.number(),
  "artistMusixMatchId": zod.number()
})

export const putUsersSelfSelfIdArtistsArtistMusixMatchIdFavoriteBody = zod.object({
  "isFavorite": zod.boolean()
})

export const putUsersSelfSelfIdArtistsArtistMusixMatchIdFavoriteResponse = zod.object({
  "isFavorite": zod.boolean()
})


/**
 * @summary Block a user.
 */
export const postUsersSelfSelfIdBlockingTargetUserIdParams = zod.object({
  "selfId": zod.number(),
  "targetUserId": zod.number()
})


/**
 * @summary Unblock a user.
 */
export const deleteUsersSelfSelfIdBlockingTargetUserIdParams = zod.object({
  "selfId": zod.number(),
  "targetUserId": zod.number()
})

export const deleteUsersSelfSelfIdBlockingTargetUserIdResponse = zod.object({
  "blocked": zod.boolean(),
  "username": zod.string()
})


/**
 * It transforms the friend into a normal stranger.
 * @summary Removes a friend.
 */
export const deleteUsersSelfSelfIdFriendsTargetUserIdParams = zod.object({
  "selfId": zod.number(),
  "targetUserId": zod.number()
})

export const deleteUsersSelfSelfIdFriendsTargetUserIdResponseUsernameMin = 3;

export const deleteUsersSelfSelfIdFriendsTargetUserIdResponseUsernameMax = 50;

export const deleteUsersSelfSelfIdFriendsTargetUserIdResponseUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');


export const deleteUsersSelfSelfIdFriendsTargetUserIdResponse = zod.object({
  "username": zod.string().min(deleteUsersSelfSelfIdFriendsTargetUserIdResponseUsernameMin).max(deleteUsersSelfSelfIdFriendsTargetUserIdResponseUsernameMax).regex(deleteUsersSelfSelfIdFriendsTargetUserIdResponseUsernameRegExp)
})


/**
 * @summary Sends a friend request
 */
export const postUsersSelfSelfIdFriendsTargetUserIdParams = zod.object({
  "selfId": zod.number(),
  "targetUserId": zod.number()
})


/**
 * @summary It accepts a friend request.
 */
export const putUsersSelfSelfIdFriendsTargetUserIdParams = zod.object({
  "selfId": zod.number(),
  "targetUserId": zod.number()
})

export const putUsersSelfSelfIdFriendsTargetUserIdResponseStatusRegExp = new RegExp('^(pending|blocked|accepted)$');
export const putUsersSelfSelfIdFriendsTargetUserIdResponseUsernameMin = 3;

export const putUsersSelfSelfIdFriendsTargetUserIdResponseUsernameMax = 50;

export const putUsersSelfSelfIdFriendsTargetUserIdResponseUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');


export const putUsersSelfSelfIdFriendsTargetUserIdResponse = zod.object({
  "status": zod.string().regex(putUsersSelfSelfIdFriendsTargetUserIdResponseStatusRegExp),
  "username": zod.string().min(putUsersSelfSelfIdFriendsTargetUserIdResponseUsernameMin).max(putUsersSelfSelfIdFriendsTargetUserIdResponseUsernameMax).regex(putUsersSelfSelfIdFriendsTargetUserIdResponseUsernameRegExp)
})


/**
 * @summary Gets information about the user's friends leaderboard on the game mode.
 */
export const getUsersSelfSelfIdFriendsLeaderboardsParams = zod.object({
  "selfId": zod.number()
})

export const getUsersSelfSelfIdFriendsLeaderboardsQueryAmountMax = 50;
export const getUsersSelfSelfIdFriendsLeaderboardsQueryGameModesItemRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const getUsersSelfSelfIdFriendsLeaderboardsQueryParams = zod.object({
  "start": zod.number(),
  "amount": zod.number().max(getUsersSelfSelfIdFriendsLeaderboardsQueryAmountMax),
  "gameModes": zod.array(zod.string().regex(getUsersSelfSelfIdFriendsLeaderboardsQueryGameModesItemRegExp))
})

export const getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameMin = 3;

export const getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameMax = 50;

export const getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameRegExp = new RegExp('^[a-zA-Z0-9\\.-_]+$');
export const getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemNameMax = 25;


export const getUsersSelfSelfIdFriendsLeaderboardsResponse = zod.object({
  "leaderboard": zod.array(zod.object({
  "id": zod.number(),
  "username": zod.string().min(getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameMin).max(getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameMax).regex(getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemUsernameRegExp),
  "name": zod.string().min(1).max(getUsersSelfSelfIdFriendsLeaderboardsResponseLeaderboardItemNameMax),
  "profilePictureFilename": zod.string()
}).and(zod.object({
  "score": zod.number(),
  "rank": zod.number()
})))
})


/**
 * @summary Get information about a melodle game.
 */
export const getUsersSelfSelfIdGameGuessLineParams = zod.object({
  "selfId": zod.number(),
  "gameId": zod.number()
})

export const getUsersSelfSelfIdGameGuessLineResponseAttemptsItemGuessedLineMax = 1000;
export const getUsersSelfSelfIdGameGuessLineResponseGameModeRegExp = new RegExp('^(Guess Line|Guess Song)$');
export const getUsersSelfSelfIdGameGuessLineResponseConfigModeRegExp = new RegExp('^(Guess Line|Guess Song)$');


export const getUsersSelfSelfIdGameGuessLineResponse = zod.object({
  "userId": zod.number(),
  "gameId": zod.number(),
  "attempts": zod.array(zod.object({
  "guessedSongId": zod.string(),
  "guessedAt": zod.string().datetime()
})).or(zod.array(zod.object({
  "guessedLine": zod.string().max(getUsersSelfSelfIdGameGuessLineResponseAttemptsItemGuessedLineMax),
  "guessedAt": zod.string().datetime()
}))),
  "won": zod.boolean().optional(),
  "endingTime": zod.string().datetime().optional(),
  "gameMode": zod.string().regex(getUsersSelfSelfIdGameGuessLineResponseGameModeRegExp),
  "config": zod.object({
  "id": zod.number(),
  "mode": zod.string().regex(getUsersSelfSelfIdGameGuessLineResponseConfigModeRegExp),
  "onlyFavoriteArtists": zod.boolean(),
  "fromArtists": zod.array(zod.string())
})
})


/**
 * @summary Start a new melodle game.
 */
export const postUsersSelfSelfIdGameGuessSongParams = zod.object({
  "selfId": zod.number()
})

export const postUsersSelfSelfIdGameGuessSongBody = zod.object({
  "fromArtists": zod.array(zod.string())
})


/**
 * @summary Get information about a melodle game.
 */
export const getUsersSelfSelfIdGameGuessSongGameIdParams = zod.object({
  "selfId": zod.number(),
  "gameId": zod.number()
})

export const getUsersSelfSelfIdGameGuessSongGameIdResponse = zod.object({
  "attempts": zod.array(zod.object({
  "trackSnippet": zod.string().optional(),
  "isCorrectAlbum": zod.boolean(),
  "isCorrectTrack": zod.boolean(),
  "guessedTrackNameHint": zod.string(),
  "guessedTrackSpotifyId": zod.string(),
  "guessedTrackName": zod.string(),
  "guessedTrackAlbumName": zod.string(),
  "guessedTrackAlbumImages": zod.array(zod.object({
  "url": zod.string(),
  "width": zod.number().or(zod.null()),
  "height": zod.number().or(zod.null())
}))
})),
  "artists": zod.array(zod.object({
  "spotifyArtistId": zod.string(),
  "name": zod.string()
})),
  "album": zod.object({
  "images": zod.array(zod.object({
  "url": zod.string(),
  "width": zod.number().or(zod.null()),
  "height": zod.number().or(zod.null())
})).optional(),
  "name": zod.string().optional(),
  "genres": zod.array(zod.string()).optional(),
  "label": zod.string().optional()
}).optional()
})


/**
 * @summary Submit a guess for a melodle game.
 */
export const postUsersSelfSelfIdGameGuessLineGameIdAttemptsParams = zod.object({
  "selfId": zod.number(),
  "gameId": zod.number()
})

export const postUsersSelfSelfIdGameGuessLineGameIdAttemptsBodyGuessedLineMax = 1000;


export const postUsersSelfSelfIdGameGuessLineGameIdAttemptsBody = zod.object({
  "guessedLine": zod.string().max(postUsersSelfSelfIdGameGuessLineGameIdAttemptsBodyGuessedLineMax)
})

export const postUsersSelfSelfIdGameGuessLineGameIdAttemptsResponseGuessLineHintsItemRegExp = new RegExp('^(Correct spot|Correct letter, wrong spot\\.|Wrong)$');


export const postUsersSelfSelfIdGameGuessLineGameIdAttemptsResponse = zod.object({
  "guessLineHints": zod.array(zod.string().regex(postUsersSelfSelfIdGameGuessLineGameIdAttemptsResponseGuessLineHintsItemRegExp)),
  "input": zod.string(),
  "won": zod.boolean()
})


/**
 * @summary Submit a guess for a melodle game.
 */
export const postUsersSelfSelfIdGameGuessSongGameIdAttemptsParams = zod.object({
  "selfId": zod.number(),
  "gameId": zod.number()
})

export const postUsersSelfSelfIdGameGuessSongGameIdAttemptsBody = zod.object({
  "guessedTrackSpotifyId": zod.string()
})


