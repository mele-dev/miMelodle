/* @name selectUsers */
SELECT *
FROM users;

/* @name loginUser */
SELECT id
  FROM users
 WHERE email = :emailOrUsername! or username = :emailOrUsername!
   AND check_password("passwordHash", :password!);

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
SELECT f."user2Id",
       f."userId",
       f.status,
       u.name       as name1,
       u2.name      as name2,
       u.username   as username1,
       u2.username  as username2,
       pP.id        as "profilePictureId1",
       pP2.id       as "profilePictureId2",
       pP.filename  as "profilePictureFilename1",
       pP2.filename as "profilePictureFilename2"
FROM friendships f
         inner join public.users u2 on u2.id = f."user2Id"
         inner join public.users u on u.id = f."userId"
         inner join public."profilePictures" pP on pP.id = u."profilePictureId"
         inner join public."profilePictures" pP2 on pP2.id = u2."profilePictureId"
where "user2Id" = :selfId!
   or "userId" = :selfId!;

/* @name deleteFriend */
delete
from friendships f
where (f."userId" = :selfId! and f."user2Id" = :targetUserId!)
   or (f."userId" = :targetUserId! and f."user2Id" = :selfId!)
RETURNING *;

/* @name addNewFriend */
insert into friendships ("userId", "user2Id")
values (:selfId!, :targetUserId!)
RETURNING status;

/* @name acceptRequest */
update friendships f
set status = 'accepted'
where (f."userId" = :selfId! and f."user2Id" = :targetUserId!)
   or (f."userId" = :targetUserId! and f."user2Id" = :selfId!);

/* @name getStatus */
SELECT status
FROM friendships f
where (f."userId" = :selfId! and f."user2Id" = :targetUserId!)
   or (f."userId" = :targetUserId! and f."user2Id" = :selfId!);

/* @name blockUser */
INSERT INTO blocks("userWhoBlocksId", "blockedUserId")
values (:selfId!, :targetUserId!)
RETURNING *;

/* @name unblockUser */
DELETE
FROM blocks
WHERE "userWhoBlocksId" = :selfId!
  and "blockedUserId" = :targetUserId!
RETURNING *;

/* @name getRequestReceiver */
SELECT "user2Id"
FROM friendships f
where (f."userId" = :selfId! and f."user2Id" = :targetUserId!)
   or (f."userId" = :targetUserId! and f."user2Id" = :selfId!);

/* @name isUserBlocked */ 
SELECT *
from blocks b
where ((b."blockedUserId" = :selfId! and b."userWhoBlocksId" = :targetUserId!) or
       (b."blockedUserId" = :targetUserId! and b."userWhoBlocksId" = :selfId!));

/* @name blockAlreadyExists */
SELECT *
from blocks b
where (b."blockedUserId" = :selfId! and b."userWhoBlocksId" = :targetUserId!);
=======
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
>>>>>>> main
