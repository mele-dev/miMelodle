import { SafeType } from "../utils/typebox.js";
import { artistSchema } from "./artist.js";
import { melodleGameConfig, MelodleGameSchema } from "./melodle.js";
import { profilePictureSchema } from "./public.js";
import { trackSchema } from "./track.js";
import { userSchema } from "./user.js";

export const ParamsSchema = SafeType.Object({
    userId: userSchema.properties.id,
    selfId: userSchema.properties.id,
    filename: profilePictureSchema.properties.id,
    friendId: userSchema.properties.id,
    gameMode: MelodleGameSchema.properties.gameMode,
    optionalGameMode: SafeType.Optional(MelodleGameSchema.properties.gameMode),
    artistMusixMatchId: artistSchema.properties.musixmatchArtistId,
    melodleConfigId: melodleGameConfig.properties.id,
    gameId: MelodleGameSchema.properties.gameId,
    trackMusixMatchId: trackSchema.properties.trackId,
});
