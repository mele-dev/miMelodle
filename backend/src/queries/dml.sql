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
