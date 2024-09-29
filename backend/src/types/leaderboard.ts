import { Static } from "@sinclair/typebox";
import { SafeType } from "../utils/typebox.js";
import { userSchema } from "./user.js";

export const leaderboardSchema = SafeType.Array(
    SafeType.Intersect(
        [
            SafeType.Pick(userSchema, ["id", "username", "name"]),
            SafeType.Object({
                score: SafeType.Number({
                    description: "Score calculated by user performance within their games.",
                }),
                profileUrl: SafeType.String({
                    description: "URL to download a profile picture.",
                }),
                rank: SafeType.Integer({
                    description: "Players' position ordered from higest to lowest score."
                })
            })
        ],
        {
            $id: "LeaderboardSchema",
            title: "leaderboardSchema",
        }
    )
)


export const jwtTokenSchema = SafeType.Object(
    {
        jwtToken: SafeType.String({
            description:
                "The 'encrypted' jwt token. It is easily decryptable, " +
                "so no sensitive information is stored there.",
        }),
    },
    {
        description: "A token which will serve to authenticate a user.",
        $id: "jwtToken"
    }
);

export type Leaderboard = Static<typeof leaderboardSchema>;
