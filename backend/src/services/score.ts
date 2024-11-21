export const basePoints = 100;

/**
 * Calculate the score increment based on the current score and number of turns.
 * @param currentScore - The player's current score.
 * @param turns - The number of turns it took to win the match (1-6).
 * @returns The score increment.
 */
export function calculateScoreIncrement(
    currentScore: number,
    turns: number
): number {
    if (turns < 1 || turns > 6) {
        throw new Error("Turns must be between 1 and 6.");
    }

    // Exponential decay beyond the soft cap
    const softCap = 5000;
    const decayFactor =
        currentScore > softCap
            ? 1 / (1 + (currentScore - softCap) / 500) // Smooth decay after the cap
            : Math.exp(-currentScore / softCap); // Logarithmic decay before the cap

    // Base increment clamped to a minimum of 10
    let increment = Math.max(10, basePoints * decayFactor);

    // Multiply by unused attempts factor AFTER clamping
    const unusedAttemptsFactor = 1 + (6 - turns) / 6;
    increment *= unusedAttemptsFactor;

    return Math.round(increment);
}

/**
 * Calculate the score decrement as a negative integer based on the current score.
 * @param currentScore - The player's current score.
 */
export function calculateScoreDecrement(currentScore: number): number {
    return -Math.max(Math.round(currentScore * 0.02));
}
