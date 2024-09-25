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