DROP SCHEMA IF EXISTS public CASCADE;

CREATE SCHEMA public;

CREATE TABLE profile_pictures (
    id        SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL
);

CREATE DOMAIN email_domain AS VARCHAR(254) CHECK ( value ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$' );

CREATE DOMAIN username_domain AS VARCHAR(20) CHECK ( LENGTH(value) >= 3 );

CREATE TABLE users (
    id                 SERIAL PRIMARY KEY,
    username           username_domain UNIQUE                            NOT NULL,
    -- https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
    email              email_domain UNIQUE                               NOT NULL,
    password_hash      TEXT                                              NULL,
    spotify_id         TEXT UNIQUE                                       NULL,
    profile_picture_id BIGINT REFERENCES profile_pictures (id) DEFAULT 0 NOT NULL,
    name               VARCHAR(25)                                       NOT NULL,
    CHECK ( password_hash IS NOT NULL OR spotify_id IS NOT NULL )
);

CREATE TYPE friendship_status AS ENUM ('pending', 'accepted', 'blocked');

CREATE TABLE friendships (
    id         SERIAL PRIMARY KEY,
    user_id    BIGINT REFERENCES users (id)        NOT NULL,
    friend_id  BIGINT REFERENCES users (id)        NOT NULL,
    created_at timestamptz       DEFAULT NOW()     NOT NULL,
    status     friendship_status DEFAULT 'pending' NOT NULL,
    CHECK ( user_id <> friendships.friend_id )
);

CREATE TABLE artists (
    id                   SERIAL PRIMARY KEY,
    musixmatch_artist_id TEXT UNIQUE NOT NULL
);

CREATE TABLE saved_artists (
    id          SERIAL PRIMARY KEY,
    user_id     BIGINT REFERENCES users (id)   NOT NULL,
    artist_id   BIGINT REFERENCES artists (id) NOT NULL,
    saved_at    timestamptz DEFAULT NOW()      NOT NULL,
    is_favorite bool        DEFAULT FALSE      NOT NULL
);

CREATE TABLE streaks (
    id           SERIAL PRIMARY KEY,
    user_id      BIGINT REFERENCES users (id) NOT NULL,
    streak_count BIGINT      DEFAULT 0        NOT NULL,
    last_updated timestamptz DEFAULT NOW()    NOT NULL,
    max_streak   INTEGER     DEFAULT 0        NOT NULL
);

CREATE TABLE songs (
    id            SERIAL PRIMARY KEY,
    musixmatch_id TEXT NOT NULL UNIQUE
);

CREATE TABLE games (
    id        SERIAL PRIMARY KEY,
    user_id   BIGINT REFERENCES users (id) NOT NULL,
    song_id   BIGINT REFERENCES songs (id) NOT NULL,
    game_date DATE DEFAULT NOW()::DATE     NOT NULL
);

CREATE TABLE attempts (
    id              SERIAL PRIMARY KEY,
    game_id         BIGINT REFERENCES games (id) NOT NULL,
    guessed_song_id BIGINT REFERENCES songs (id) NOT NULL,
    guessed_at      timestamptz                  NOT NULL
);

CREATE TABLE game_modes (
    id   SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT
  INTO game_modes(name)
VALUES ('guess_line')
     , ('guess_song');

SELECT *
  FROM game_modes;

CREATE TABLE game_config (
    id        SERIAL PRIMARY KEY,
    user_id   BIGINT REFERENCES users (id)                NOT NULL,
    game_mode BIGINT DEFAULT 1 REFERENCES game_modes (id) NOT NULL
);

COMMENT ON TABLE game_config IS 'Configs are a work in progress.';

CREATE TABLE artist_game_config (
    game_config_id BIGINT REFERENCES game_config (id) NOT NULL,
    artist_id      BIGINT REFERENCES artists (id)     NOT NULL,
    PRIMARY KEY (game_config_id, artist_id)
);

CREATE TABLE artist_song (
    song_id   BIGINT REFERENCES songs (id)   NOT NULL,
    artist_id BIGINT REFERENCES artists (id) NOT NULL
);
