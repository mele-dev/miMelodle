import { leaderboardSchema } from "./leaderboard.js";
import { jwtTokenSchema, userSchema } from "./user.js";

export default [
    userSchema,
    jwtTokenSchema,
    leaderboardSchema
];
