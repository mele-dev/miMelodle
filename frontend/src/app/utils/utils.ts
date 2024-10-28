/** Utility to assert exhaustiveness */
export function assertUnreachable(x: never): never {
    throw new Error(
        "Didn't expect to get here. Value: " + (JSON.stringify(x) || "Nothing.")
    );
}
