DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE EXTENSION IF NOT EXISTS fuzzystrmatch;

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE "profilePictures" (
    id         SERIAL PRIMARY KEY,
    "filename" TEXT UNIQUE NOT NULL
);

CREATE DOMAIN email_domain AS VARCHAR(254) CHECK ( value ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$' );

CREATE DOMAIN username_domain AS VARCHAR(50) CHECK ( LENGTH(value) >= 3 AND value ~ '^[a-zA-Z0-9\.-_]+$' );

CREATE OR REPLACE FUNCTION get_default_profile_picture() RETURNS BIGINT AS $$
DECLARE
    default_id BIGINT;
BEGIN
    SELECT pp.id INTO default_id FROM "profilePictures" pp WHERE pp.filename = 'default.svg' LIMIT 1;

    RETURN default_id;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE users (
    id                 SERIAL PRIMARY KEY,
    username           username_domain UNIQUE                   NOT NULL,
    -- https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
    email              email_domain UNIQUE                      NOT NULL,
    "passwordHash"     TEXT                                     NULL,
    "spotifyId"        TEXT UNIQUE                              NULL,
    "profilePictureId" BIGINT REFERENCES "profilePictures" (id) NOT NULL DEFAULT get_default_profile_picture(),
    name               VARCHAR(25)                              NOT NULL,
    CHECK ( ("passwordHash" IS NOT NULL OR "spotifyId" IS NOT NULL) AND LENGTH(name) >= 1 )
);

-- Optimize username for fuzzy searching.
CREATE INDEX users_username_trgm_idx ON users USING gin (username gin_trgm_ops);

CREATE TYPE "friendshipStatus" AS ENUM ('pending', 'accepted', 'blocked');

CREATE TABLE friendships (
    id          SERIAL PRIMARY KEY,
    "userId"    BIGINT REFERENCES users (id)         NOT NULL,
    "friendId"  BIGINT REFERENCES users (id)         NOT NULL,
    "createdAt" timestamptz        DEFAULT NOW()     NOT NULL,
    status      "friendshipStatus" DEFAULT 'pending' NOT NULL,
    CHECK ( "userId" <> friendships."friendId" )
);

CREATE TABLE artists (
    id                   SERIAL PRIMARY KEY,
    "musixmatchArtistId" TEXT UNIQUE NOT NULL
);

CREATE TABLE saved_artists (
    id           SERIAL PRIMARY KEY,
    "userId"     BIGINT REFERENCES users (id)   NOT NULL,
    "artistId"   BIGINT REFERENCES artists (id) NOT NULL,
    "savedAt"    timestamptz DEFAULT NOW()      NOT NULL,
    "isFavorite" bool        DEFAULT FALSE      NOT NULL
);

CREATE TABLE streaks (
    id            SERIAL PRIMARY KEY,
    "userId"      BIGINT REFERENCES users (id) NOT NULL,
    "streakCount" BIGINT      DEFAULT 0        NOT NULL,
    "lastUpdated" timestamptz DEFAULT NOW()    NOT NULL,
    "maxStreak"   INTEGER     DEFAULT 0        NOT NULL
);

CREATE TABLE songs (
    id             SERIAL PRIMARY KEY,
    "musixmatchId" TEXT NOT NULL UNIQUE
);

CREATE TABLE games (
    id       SERIAL PRIMARY KEY,
    "userId" BIGINT REFERENCES users (id) NOT NULL,
    "songId" BIGINT REFERENCES songs (id) NOT NULL,
    "gameId" DATE DEFAULT NOW()::DATE     NOT NULL
);

CREATE TABLE attempts (
    id              SERIAL PRIMARY KEY,
    "gameId"        BIGINT REFERENCES games (id) NOT NULL,
    "guessedSongId" BIGINT REFERENCES songs (id) NOT NULL,
    "guessedAt"     timestamptz                  NOT NULL
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
    id         SERIAL PRIMARY KEY,
    "userId"   BIGINT REFERENCES users (id)                 NOT NULL,
    "gameMode" BIGINT DEFAULT 1 REFERENCES "gameModes" (id) NOT NULL
);

CREATE TABLE "artistGameConfig" (
    "gameConfigId" BIGINT REFERENCES "gameConfig" (id) NOT NULL,
    "artistId"     BIGINT REFERENCES artists (id)      NOT NULL,
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
