import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import { userSchema } from "./user.js";
import { createRangeSchema } from "./rangeSchema.js";

export const leaderboardSchema = SafeType.Object(
    {
        leaderboard: SafeType.Array(
            SafeType.Object({
                ...SafeType.Pick(userSchema, [
                    "id",
                    "username",
                    "name",
                    "profilePictureId",
                    "profilePictureFilename",
                ]).properties,
                score: SafeType.Number({
                    description:
                        "Score calculated by user performance within their games.",
                }),
                rank: SafeType.Number(),
            })
        ),
        mode: SafeType.StringEnum(["guessLine", "guessSong"]),
        totalPages: SafeType.Number(),
    },
    {
        $id: "LeaderboardSchema",
        title: "leaderboardSchema",
        description: "A leaderboard of popdle users.",
    }
);

export const leaderBoardRangeSchema = createRangeSchema(50);

export type Leaderboard = Static<typeof leaderboardSchema>;
