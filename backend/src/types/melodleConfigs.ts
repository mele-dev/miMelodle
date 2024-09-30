import { SafeType } from "../utils/typebox.js";
import { artistSchema } from "./artist.js";
import { gameModes } from "./melodle.js";

export const melodleGameConfig = SafeType.Object({
    id: SafeType.Integer({ description: "Unique identifier for a config." }),
    mode: SafeType.StringEnum([...gameModes]),
    onlyFavoriteArtists: SafeType.Boolean({
        description: "Whether to pick from any artist or only favorited ones.",
    }),
    fromArtists: SafeType.Array(
        SafeType.Pick(artistSchema, ["musixmatchArtistId"]),
        {
            description:
                "The artists we can choose from. If empty, it means this filter does not do anything.",
        }
    ),
});
