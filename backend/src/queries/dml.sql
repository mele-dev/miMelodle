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
    WHERE username = :oldUsername!
RETURNING username;

/* @name deleteUser */
   DELETE
     FROM users
    WHERE id = :id!
RETURNING *;

/* @name selectAllIcons */
SELECT *
  FROM "profilePictures";

/* @name deleteIcons */
   DELETE
     FROM "profilePictures"
RETURNING 1 as output;

/*
  @name insertIcons
  @param input -> ((id!, filename!)...)
*/
INSERT
  INTO "profilePictures" (id, filename)
VALUES :input;