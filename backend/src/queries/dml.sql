/* @name selectUsers */
SELECT *
  FROM users;

/* @name loginUser */
SELECT id
  FROM users
 WHERE email = :email!
   AND check_password(password_hash, :password!);

/* @name getFriendships */
SELECT f.status
  FROM friendships f
           LEFT JOIN public.users u ON u.id = f.user_id
 WHERE u.id = :id!;

/* @name insertUser */
INSERT
    INTO users (username, email, password_hash, spotify_id, profile_picture_id, name)
    VALUES (:username!, :email!, encrypt_password(:password!), null, :profilePictureId!, :name!)
        RETURNING id;