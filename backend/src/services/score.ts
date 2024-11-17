const basePoints = 100;
const basePoints = 100;

/**
 * Calculate the score increment based on the current score and number of turns.
 * @param currentScore - The player's current score.
 * @param turns - The number of turns it took to win the match (1-6).
 * @returns The score increment.
 */
function calculateScoreIncrement(currentScore: number, turns: number): number {
    if (turns < 1 || turns > 6) {
        throw new Error("Turns must be between 1 and 6.");
    }

    // Exponential decay beyond the soft cap
    const softCap = 5000;
    const decayFactor = currentScore > softCap
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
 * Calculate the score decrement based on the current score.
 * @param currentScore - The player's current score.
 */
function calculateScoreDecrement(currentScore: number): number {
    return Math.max(Math.round(currentScore * 0.02));
}

const examples: [number, number][] = [
    [200, 1],
    [500, 1],
    [500, 4],
    [1000, 1],
    [4000, 1],
    [5000, 1],
    [6000, 1],
    [9000, 1],
    [10000, 1],
    [10000, 2],
    [10000, 3],
    [10000, 4],
    [10000, 5],
    [10000, 6],
    [20000, 1],
];

for (const [score, attempts] of examples) {
    console.log(
        `[${score}, ${attempts}]:\t (increment: ${calculateScoreIncrement(score, attempts)})\t(decrement: ${calculateScoreDecrement(score)})`
    );
}

//console.log("### Losses:");
//for (const [score, attempts] of examples) {
//    console.log(
//        `[${score}, ${attempts}]: ${calculateScoreIncrement(score, attempts)}`
//    );
//}

/**
 * Calculate the score increment based on the current score and number of turns.
 * @param currentScore - The player's current score.
 * @param turns - The number of turns it took to win the match (1-6).
 * @returns The score increment.
 */
function calculateScoreIncrement(currentScore: number, turns: number): number {
    if (turns < 1 || turns > 6) {
        throw new Error("Turns must be between 1 and 6.");
    }

    // Exponential decay beyond the soft cap
    const softCap = 5000;
    const decayFactor = currentScore > softCap
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
 * Calculate the score decrement based on the current score.
 * @param currentScore - The player's current score.
 */
function calculateScoreDecrement(currentScore: number): number {
    return Math.max(Math.round(currentScore * 0.02));
}

const examples: [number, number][] = [
    [200, 1],
    [500, 1],
    [500, 4],
    [1000, 1],
    [4000, 1],
    [5000, 1],
    [6000, 1],
    [9000, 1],
    [10000, 1],
    [10000, 2],
    [10000, 3],
    [10000, 4],
    [10000, 5],
    [10000, 6],
    [20000, 1],
];

for (const [score, attempts] of examples) {
    console.log(
        `[${score}, ${attempts}]:\t (increment: ${calculateScoreIncrement(score, attempts)})\t(decrement: ${calculateScoreDecrement(score)})`
    );
}

//console.log("### Losses:");
//for (const [score, attempts] of examples) {
//    console.log(
//        `[${score}, ${attempts}]: ${calculateScoreIncrement(score, attempts)}`
//    );
//}
