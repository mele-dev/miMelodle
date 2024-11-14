/* @name selectUsers */
SELECT *
  FROM users;

/* @name loginUser */
SELECT id
  FROM users
 WHERE email = :emailOrUsername!
    OR username = :emailOrUsername! AND check_password("passwordHash", :password!);

/* @name insertUser */
   INSERT
     INTO users (username, email, "passwordHash", "spotifyId", "profilePictureId", name)
   VALUES (:username!, :email!, encrypt_password(:password!), default, :profilePictureId!, :name!)
RETURNING id;

/* @name updateUser */
   UPDATE users
      SET username           = :username!
        , email              = :email!
        , "passwordHash"     = encrypt_password(:password!)
        , "profilePictureId" = :profilePictureId!
        , name               = :name!
    WHERE id = :selfId!
RETURNING username;

/* @name deleteUser */
   DELETE
     FROM users
    WHERE id = :selfId!
RETURNING *;

/* @name selectAllIcons */
SELECT *
  FROM "profilePictures";

/* @name deleteIcons */
   DELETE
     FROM "profilePictures"
RETURNING 1 AS output;

/* @name getSelfuser */
SELECT pp.filename AS "profilePictureFile", u.name, u.email, u.username, u.id
  FROM users u
           INNER JOIN public."profilePictures" pp ON pp.id = u."profilePictureId"
 WHERE u.id = :selfId!;

/* @name insertIcon */
INSERT
  INTO "profilePictures" (filename)
VALUES (:file!);

/* @name beginTransaction */
BEGIN;

/* @name commitTransaction */
COMMIT;

/* @name rollbackTransaction */
ROLLBACK;

/* @name getSelfFriends */
SELECT f."user2Id"
     , f."userId"
     , f.status
     , u.name       AS name1
     , u2.name      AS name2
     , u.username   AS username1
     , u2.username  AS username2
     , pp.id        AS "profilePictureId1"
     , pp2.id       AS "profilePictureId2"
     , pp.filename  AS "profilePictureFilename1"
     , pp2.filename AS "profilePictureFilename2"
  FROM friendships f
           INNER JOIN public.users u2 ON u2.id = f."user2Id"
           INNER JOIN public.users u ON u.id = f."userId"
           INNER JOIN public."profilePictures" pp ON pp.id = u."profilePictureId"
           INNER JOIN public."profilePictures" pp2 ON pp2.id = u2."profilePictureId"
 WHERE "user2Id" = :selfId!
    OR "userId" = :selfId!;

/* @name deleteFriend */
     WITH target AS (
         SELECT *
           FROM users u
          WHERE u.id = :targetUserId!
          LIMIT 1
     )
   DELETE
     FROM friendships f
    WHERE (f."userId" = :selfId! AND f."user2Id" = :targetUserId!)
       OR (f."userId" = :targetUserId! AND f."user2Id" = :selfId!)
RETURNING (
    SELECT username
      FROM target
) AS "targetUsername!";

/* @name addNewFriend */
     WITH target AS (
         SELECT *
           FROM users u
          WHERE u.id = :targetUserId!
          LIMIT 1
     )
   INSERT
     INTO friendships ("userId", "user2Id")
   VALUES (:selfId!, :targetUserId!)
RETURNING status, (
    SELECT username
      FROM target
) AS "targetUsername!";

/* @name acceptRequest */
     WITH target AS (
         SELECT *
           FROM users u
          WHERE u.id = :targetUserId!
          LIMIT 1
     )
   UPDATE friendships f
      SET status = 'accepted'
    WHERE (f."userId" = :selfId! AND f."user2Id" = :targetUserId!)
       OR (f."userId" = :targetUserId! AND f."user2Id" = :selfId!)
RETURNING status, (
    SELECT username
      FROM target
) AS "targetUsername!";

/* @name getStatus */
SELECT status
  FROM friendships f
 WHERE (f."userId" = :selfId! AND f."user2Id" = :targetUserId!)
    OR (f."userId" = :targetUserId! AND f."user2Id" = :selfId!);

/* @name blockUser */
     WITH target AS (
         SELECT *
           FROM users u
          WHERE u.id = :targetUserId!
          LIMIT 1
     )
   INSERT
     INTO blocks("userWhoBlocksId", "blockedUserId")
   VALUES (:selfId!, :targetUserId!)
RETURNING (
    SELECT username
      FROM target
) AS "targetUsername!";

/* @name unblockUser */
     WITH target AS (
         SELECT *
           FROM users u
          WHERE u.id = :targetUserId!
          LIMIT 1
     )
   DELETE
     FROM blocks
    WHERE "userWhoBlocksId" = :selfId!
      AND "blockedUserId" = :targetUserId!
RETURNING (
    SELECT username
      FROM target
) AS "targetUsername!";

/* @name getBlockedUsers */
SELECT u.*, pp.filename AS "profilePictureFilename"
  FROM users u
           JOIN blocks b ON u.id = b."blockedUserId"
           INNER JOIN public."profilePictures" pp ON pp.id = u."profilePictureId"
 WHERE b."userWhoBlocksId" = :selfId;

/* @name getRequestReceiver */
SELECT "user2Id"
  FROM friendships f
 WHERE (f."userId" = :selfId! AND f."user2Id" = :targetUserId!)
    OR (f."userId" = :targetUserId! AND f."user2Id" = :selfId!);

/* @name isUserBlocked */
SELECT *
  FROM blocks b
 WHERE ((b."blockedUserId" = :selfId! AND b."userWhoBlocksId" = :targetUserId!) OR
        (b."blockedUserId" = :targetUserId! AND b."userWhoBlocksId" = :selfId!));

/* @name blockAlreadyExists */
SELECT *
  FROM blocks b
 WHERE (b."blockedUserId" = :selfId! AND b."userWhoBlocksId" = :targetUserId!);

/* @name insertUserSpotify */
   INSERT
     INTO users (username, email, "passwordHash", "spotifyId", "profilePictureId", name)
   VALUES (:username!, :email!, default, :spotifyId!, default, :name!)
RETURNING id;

/* @name loginUserSpotify */
SELECT u.id
  FROM users u
 WHERE u."spotifyId" = :spotifyId!;

/* @name searchForUserEmailOrUsername */
SELECT u.username, u.email
  FROM users u
 WHERE u.username = :username
    OR u.email = :email;

/* @name searchUser */
  WITH similarity     AS (
      SELECT u.*, similarity(u.username, :username!) AS "rank!" FROM users u
  ),
       filtered_users AS (
      SELECT *
        FROM similarity
       WHERE "rank!" >= :rankThreshold!
  )
SELECT u.*, pp.filename AS "profilePictureFilename", CEIL(COUNT(*) OVER () / :pageSize!::FLOAT) AS "totalPages!"
  FROM filtered_users u
           INNER JOIN "profilePictures" pp ON u."profilePictureId" = pp.id
 ORDER BY "rank!" DESC, levenshtein(u.username, :username!)
 LIMIT :pageSize! OFFSET :pageSize!::INT * :page!::INT;

/* @name addArtistToHome */
INSERT INTO "savedArtists"("userId", "spotifyArtistId")
values (:selfId!, :spotifyArtistId!)
returning *;

/* @name deleteArtistFromHome */
DELETE
FROM "savedArtists"
WHERE "userId" = :selfId
  AND "spotifyArtistId" = :spotifyArtistId
returning *;


/* @name changeFavorite */
update "savedArtists"
set "isFavorite" = :isFavorite
WHERE "userId" = :selfId!
  AND "spotifyArtistId" = :spotifyArtistId
returning "isFavorite";

/* @name countFavorites */
SELECT COUNT(*)
FROM "savedArtists"
WHERE "userId" = :selfId! AND "isFavorite" = true;


/* @name getHomeArtists */
SELECT "spotifyArtistId", "isFavorite"
from "savedArtists"
where "userId" = :selfId!;

/* @name createGuessSongGame */
  WITH "newestGame"    AS (
      SELECT * FROM "guessSongGames" gsg WHERE "userId" = :selfId! ORDER BY gsg."createdAt" DESC LIMIT 1
  ),
       "canCreateGame" AS (
      SELECT CASE
                 WHEN :allowMultipleGamesADay! THEN TRUE
                 WHEN (
                          SELECT "createdAt"::DATE
                            FROM "newestGame"
                      ) != CURRENT_DATE        THEN TRUE
                 ELSE FALSE
             END AS "canCreate"
  ),
       "insertGame"
                       AS ( INSERT INTO "guessSongGames" ("userId", "createdAt", "spotifyTrackId", "snippet") SELECT :selfId!, NOW(), :spotifyTrackId!, :snippet
                                                                                                    WHERE EXISTS (
                                                                                                        SELECT 1
                                                                                                          FROM "canCreateGame"
                                                                                                         WHERE "canCreate" = TRUE
                                                                                                    ) RETURNING id
  )
SELECT (
    SELECT "canCreate"
      FROM "canCreateGame"
)
     , "insertGame".id
  FROM "canCreateGame"
           LEFT JOIN "insertGame" ON TRUE;

/* @name getGuessSongFromUser */
  WITH "game" AS (
      SELECT *
        FROM "guessSongGames" gsg
       WHERE gsg."userId" = :selfId! AND gsg.id = :gameId!
       ORDER BY gsg."createdAt"
       LIMIT 6
  )
SELECT *
  FROM "game"
           LEFT JOIN public."guessSongAttempts" gsa ON "game".id = gsa."gameId";

/* @name insertGuessSongAttempt */
   INSERT
     INTO "guessSongAttempts" ("guessedAt", "guessedSpotifyTrackId", "gameId")
   VALUES (NOW(), :trackId!, :gameId!)
RETURNING *;
