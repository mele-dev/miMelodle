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
    username           username_domain                                   NOT NULL,
    -- https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
    email              email_domain UNIQUE                               NOT NULL,
    password_hash      TEXT                                              NULL,
    spotify_id         TEXT UNIQUE                                       NULL,
    profile_picture_id BIGINT REFERENCES profile_pictures (id) DEFAULT 0 NOT NULL,
    exposed_id         VARCHAR(50) UNIQUE                                NOT NULL,
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

CREATE OR REPLACE FUNCTION update_max_streak() RETURNS TRIGGER AS $$
BEGIN
    new := CAST(new AS streaks);
    IF new.streak_count > new.max_streak THEN
        new.max_streak := new.streak_count;
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_max_streak_trigger
    BEFORE UPDATE
    ON streaks
    FOR EACH ROW
EXECUTE FUNCTION update_max_streak();

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

CREATE OR REPLACE FUNCTION update_streak() RETURNS TRIGGER AS $$
DECLARE
    casted_new attempts;
    game       games;
BEGIN
    casted_new := CAST(new AS attempts);
    SELECT * INTO game FROM games WHERE game_date = casted_new.game_id;
    IF (casted_new.guessed_song_id = game.song_id) THEN
        UPDATE streaks SET streak_count = streaks.streak_count + 1 WHERE streaks.user_id = game.user_id;
    END IF;
    RETURN casted_new;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_max_streak_trigger
    BEFORE UPDATE
    ON attempts
    FOR EACH ROW
EXECUTE FUNCTION update_streak();

-- TODO: Discuss whether we should implement game modes like in the line below.
-- CREATE TYPE game_mode AS ENUM ('guess_line', 'guess_title', 'guess_artist');

CREATE TABLE game_modes (
    id   SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL
);

INSERT
  INTO game_modes(name)
VALUES ('guess_line')
     , ('guess_artist')
     , ('guess_song');

SELECT *
  FROM game_modes;

CREATE TABLE game_config (
    id        SERIAL PRIMARY KEY,
    user_id   BIGINT REFERENCES users (id)      NOT NULL,
    game_mode BIGINT REFERENCES game_modes (id) NOT NULL
);

COMMENT ON TABLE game_config IS 'Configs are a work in progress.';

CREATE TABLE genre (
    id                  SERIAL PRIMARY KEY,
    musixmatch_genre_id BIGINT
);

CREATE TABLE genre_game_config (
    game_config_id BIGINT REFERENCES game_config (id) NOT NULL,
    genre_id       BIGINT REFERENCES genre (id)       NOT NULL,
    PRIMARY KEY (game_config_id, genre_id)
);

CREATE TABLE artist_game_config (
    game_config_id BIGINT REFERENCES game_config (id) NOT NULL,
    artist_id      BIGINT REFERENCES artists (id)     NOT NULL,
    PRIMARY KEY (game_config_id, artist_id)
);

CREATE TABLE artist_song (
    song_id   BIGINT REFERENCES songs (id)   NOT NULL,
    artist_id BIGINT REFERENCES artists (id) NOT NULL
);