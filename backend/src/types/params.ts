import { SafeType } from "../utils/typebox.js";
import { popdleGameConfig, PopdleGameSchema } from "./popdle.js";
import { profilePictureSchema } from "./public.js";
import { artistSchema } from "./spotify.js";
import { trackSchema } from "./track.js";
import { userSchema } from "./user.js";

export const ParamsSchema = SafeType.Object({
    userId: userSchema.properties.id,
    selfId: userSchema.properties.id,
    filename: profilePictureSchema.properties.id,
    targetUserId: userSchema.properties.id,
    gameMode: PopdleGameSchema.properties.gameMode,
    optionalGameMode: SafeType.Optional(PopdleGameSchema.properties.gameMode),
    spotifyArtistId: artistSchema.properties.spotifyArtistId,
    artistMusixMatchId: artistSchema.properties.musixmatchArtistId,
    popdleConfigId: popdleGameConfig.properties.id,
    gameId: PopdleGameSchema.properties.gameId,
    trackMusixMatchId: trackSchema.properties.trackId,
});
