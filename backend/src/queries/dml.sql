/* @name selectUsers */
SELECT *
  FROM users;

/* @name loginUser */
SELECT id
  FROM users
 WHERE email = :email!
   AND check_password(password_hash, :password!);

/* @name insertUser */
   INSERT
     INTO users (username, email, password_hash, spotify_id, profile_picture_id, name)
   VALUES (:username!, :email!, encrypt_password(:password!), default, :profilePictureId!, :name!)
RETURNING id;

/* @name updateUser */
   UPDATE users
      SET username           = :username!
        , email              = :email!
        , password_hash      = encrypt_password(:password!)
        , profile_picture_id = :profilePictureId!
        , name               = :name!
    WHERE username = :oldUsername!
RETURNING username;

/* @name deleteUser */
   DELETE
     FROM users
    WHERE id = :id!
RETURNING *;

/* @name getUser */
with friends as (select CASE
                            when f.friend_id = :id! then f.user_id
                            else f.friend_id
                            end as friendId
                 from friendships f
                 where f.friend_id = :id!
                    or f.user_id = :id!)
SELECT u.username, pp.image_url as "imageUrl", friends
FROM users u
         inner join public.profile_pictures pp on pp.id = u.profile_picture_id
WHERE username = :username!
  and id = :id!;
