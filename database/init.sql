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

CREATE TYPE "friendshipStatus" AS ENUM ('pending', 'accepted');

CREATE TABLE friendships (
    id          SERIAL PRIMARY KEY,
    "userId"    BIGINT REFERENCES users (id)         NOT NULL,
    "user2Id"   BIGINT REFERENCES users (id)         NOT NULL,
    "createdAt" timestamptz        DEFAULT NOW()     NOT NULL,
    status      "friendshipStatus" DEFAULT 'pending' NOT NULL,
    CHECK ( "userId" <> friendships."user2Id" )
);

-- Optimize username for fuzzy searching.
CREATE INDEX users_username_trgm_idx ON users USING gin (username gin_trgm_ops);

CREATE TABLE blocks (
    "userWhoBlocksId" BIGINT REFERENCES users (id) NOT NULL,
    "blockedUserId"   BIGINT REFERENCES users (id) NOT NULL,
    "createdAt"       timestamptz DEFAULT NOW()    NOT NULL,
    PRIMARY KEY ("userWhoBlocksId", "blockedUserId")
);

CREATE TABLE "savedArtists" (
    id                SERIAL PRIMARY KEY,
    "userId"          BIGINT REFERENCES users (id) NOT NULL,
    "spotifyArtistId" TEXT                         NOT NULL,
    "savedAt"         timestamptz DEFAULT NOW()    NOT NULL,
    "isFavorite"      bool        DEFAULT FALSE    NOT NULL,
    CONSTRAINT unique_user_spotify_artist UNIQUE ("userId", "spotifyArtistId")

);

CREATE TABLE streaks (
    id            SERIAL PRIMARY KEY,
    "userId"      BIGINT REFERENCES users (id) NOT NULL,
    "streakCount" BIGINT      DEFAULT 0        NOT NULL,
    "lastUpdated" timestamptz DEFAULT NOW()    NOT NULL,
    "maxStreak"   INTEGER     DEFAULT 0        NOT NULL
);

-- We can get all the info from a request to spotify for cheap, we don't need a
-- separate table.
-- CREATE TABLE songs (
--     id             SERIAL PRIMARY KEY,
--     "musixmatchId" TEXT NOT NULL UNIQUE
-- );

CREATE TABLE "guessSongGames" (
    id               SERIAL PRIMARY KEY,
    "userId"         BIGINT REFERENCES users (id) NOT NULL,
    "spotifyTrackId" TEXT                         NOT NULL,
    "createdAt"      timestamptz DEFAULT NOW()    NOT NULL
);

CREATE TABLE "guessSongAttempts" (
    "gameId"                BIGINT REFERENCES "guessSongGames" (id) NOT NULL,
    "guessedSpotifyTrackId" TEXT                                    NOT NULL,
    "guessedAt"             timestamptz                             NOT NULL,
    PRIMARY KEY ("gameId", "guessedSpotifyTrackId")
);

CREATE TABLE "gameConfig" (
    id       SERIAL PRIMARY KEY,
    "userId" BIGINT REFERENCES users (id) NOT NULL
);

CREATE TABLE "chosenArtistInConfig" (
    "gameConfigId"    BIGINT REFERENCES "gameConfig" (id) NOT NULL,
    "spotifyArtistId" TEXT                                NOT NULL,
    PRIMARY KEY ("gameConfigId", "spotifyArtistId")
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
