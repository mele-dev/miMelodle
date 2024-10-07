/* @name getUsersSnapshot */
SELECT username, email, "passwordHash", "spotifyId", "profilePictureId", name
  FROM users;

/* @name getFriendsSnapshot */
SELECT u.username AS "friendUsername", u2.username AS "userUsername", "createdAt", status
  FROM friendships
           INNER JOIN public.users u ON u.id = friendships."friendId"
           INNER JOIN public.users u2 ON u2.id = friendships."userId";