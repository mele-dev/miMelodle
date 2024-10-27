/* @name selectUsers */
SELECT *
FROM users;

/* @name loginUser */
SELECT id
FROM users
WHERE email = :email!
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
SELECT pp.filename as "profilePictureFile", u.name, u.email, u.username, u.id
FROM users u
         INNER JOIN public."profilePictures" pp ON pp.id = u."profilePictureId"
where u.id = :selfId!;

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

/* @name changeStatus */
update friendships f
set status = :status!
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
