export type ReverseMap<T extends Record<keyof T, keyof any>> = {
    [K in keyof T as T[K]]: K;
};

export function reverseMap<T extends Record<keyof T, keyof any>>(
    obj: T
): ReverseMap<T> {
    return Object.fromEntries(
        Object.entries(obj).map(([key, val]) => [val, key])
    );
}
