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
    WHERE id = :userId!
RETURNING username;

/* @name deleteUser */
   DELETE
     FROM users
    WHERE id = :id!
RETURNING *;

-- with friends as (select CASE
--                             when f.friend_id = :id! then f.user_id
--                             else f.friend_id
--                             end as friendId
--                  from friendships f
--                  where f.friend_id = :id!
--                     or f.user_id = :id!)
-- SELECT u.username, pp.image_url as "imageUrl", friends
-- FROM users u
--          inner join public.profile_pictures pp on pp.id = u.profile_picture_id
-- WHERE username = :username!
--   and id = :id!;

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
where u.id = :userId!;

/* @name insertIcon */
INSERT
  INTO "profilePictures" (filename)
VALUES (:file!);
