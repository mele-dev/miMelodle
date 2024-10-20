DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE "profilePictures" (
    id        SERIAL PRIMARY KEY,
    "filename" TEXT NOT NULL
);

CREATE DOMAIN email_domain AS VARCHAR(254) CHECK ( value ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$' );

CREATE DOMAIN username_domain AS VARCHAR(20) CHECK ( LENGTH(value) >= 3 );

CREATE TABLE users (
    id                 SERIAL PRIMARY KEY,
    username           username_domain UNIQUE                            NOT NULL,
    -- https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
    email              email_domain UNIQUE                               NOT NULL,
    "passwordHash"      TEXT                                              NULL,
    "spotifyId"         TEXT UNIQUE                                       NULL,
    "profilePictureId" BIGINT REFERENCES "profilePictures" (id) DEFAULT 0 NOT NULL,
    name               VARCHAR(25)                                       NOT NULL,
    CHECK ( "passwordHash" IS NOT NULL OR "spotifyId" IS NOT NULL )
);

CREATE TYPE "friendshipStatus" AS ENUM ('pending', 'accepted');

CREATE TABLE friendships (
    id         SERIAL PRIMARY KEY,
    "userId"    BIGINT REFERENCES users (id)        NOT NULL,
    "user2Id"  BIGINT REFERENCES users (id)        NOT NULL,
    "createdAt" timestamptz       DEFAULT NOW()     NOT NULL,
    status     "friendshipStatus" DEFAULT 'pending' NOT NULL,
    CHECK ( "userId" <> friendships."user2Id" )
);

CREATE TABLE blocks (
    id         SERIAL PRIMARY KEY,
    "userWhoBlocksId"    BIGINT REFERENCES users (id)        NOT NULL,
    "blockedUserId"    BIGINT REFERENCES users (id)        NOT NULL,
    "createdAt" timestamptz       DEFAULT NOW()     NOT NULL
);

CREATE TABLE artists (
    id                   SERIAL PRIMARY KEY,
    "musixmatchArtistId" TEXT UNIQUE NOT NULL
);

CREATE TABLE saved_artists (
    id          SERIAL PRIMARY KEY,
    "userId"     BIGINT REFERENCES users (id)   NOT NULL,
    "artistId"   BIGINT REFERENCES artists (id) NOT NULL,
    "savedAt"    timestamptz DEFAULT NOW()      NOT NULL,
    "isFavorite" bool        DEFAULT FALSE      NOT NULL
);

CREATE TABLE streaks (
    id           SERIAL PRIMARY KEY,
    "userId"      BIGINT REFERENCES users (id) NOT NULL,
    "streakCount" BIGINT      DEFAULT 0        NOT NULL,
    "lastUpdated" timestamptz DEFAULT NOW()    NOT NULL,
    "maxStreak"   INTEGER     DEFAULT 0        NOT NULL
);

CREATE TABLE songs (
    id            SERIAL PRIMARY KEY,
    "musixmatchId" TEXT NOT NULL UNIQUE
);

CREATE TABLE games (
    id        SERIAL PRIMARY KEY,
    "userId"   BIGINT REFERENCES users (id) NOT NULL,
    "songId"   BIGINT REFERENCES songs (id) NOT NULL,
    "gameId" DATE DEFAULT NOW()::DATE     NOT NULL
);

CREATE TABLE attempts (
    id              SERIAL PRIMARY KEY,
    "gameId"         BIGINT REFERENCES games (id) NOT NULL,
    "guessedSongId" BIGINT REFERENCES songs (id) NOT NULL,
    "guessedAt"      timestamptz                  NOT NULL
);

CREATE TABLE "gameModes" (
    id   SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT
  INTO "gameModes"(name)
VALUES ('Guess Line')
     , ('Guess Song');

SELECT *
  FROM "gameModes";

CREATE TABLE "gameConfig" (
    id        SERIAL PRIMARY KEY,
    "userId"   BIGINT REFERENCES users (id)                NOT NULL,
    "gameMode" BIGINT DEFAULT 1 REFERENCES "gameModes" (id) NOT NULL
);

CREATE TABLE "artistGameConfig" (
    "gameConfigId" BIGINT REFERENCES "gameConfig" (id) NOT NULL,
    "artistId"      BIGINT REFERENCES artists (id)     NOT NULL,
    PRIMARY KEY ("gameConfigId", "artistId")
);

CREATE TABLE "artistSong" (
    "songId"   BIGINT REFERENCES songs (id)   NOT NULL,
    "artistId" BIGINT REFERENCES artists (id) NOT NULL
);

CREATE OR REPLACE FUNCTION encrypt_password(
    password TEXT
) RETURNS TEXT AS $$
BEGIN
    RETURN crypt(password, gen_salt('bf'));
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION check_password(
    encrypted_password   TEXT,
    unencrypted_password TEXT
) RETURNS BOOLEAN AS $$
BEGIN
    RETURN encrypted_password = crypt(unencrypted_password, encrypted_password);
END;
$$ LANGUAGE plpgsql;

