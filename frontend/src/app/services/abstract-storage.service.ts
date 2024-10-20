import { z, ZodSchema } from "zod";

export type StorageMap = Record<string, ZodSchema>;
export abstract class AbstractStorageService<TMap extends StorageMap> {
    public abstract readonly storageMap: TMap;

    getItem<TKey extends keyof TMap & string>(
        key: TKey
    ): z.infer<TMap[TKey]> | null {
        const localStorageValue = localStorage.getItem(key);

        if (localStorageValue === null) {
            return null;
        }

        try {
            const parsedJson = JSON.parse(localStorageValue);
            const parsedZod = this.storageMap[key].safeParse(parsedJson);

            if (!parsedZod.success) {
                console.warn(
                    `Invalid data structure for key ${key}:`,
                    parsedZod.error
                );
                return null;
            }

            return parsedZod.data;
        } catch (error) {
            console.warn(`Failed to parse JSON for key ${key}:`, error);
            return null;
        }
    }

    setItem<TKey extends keyof TMap & string>(
        key: TKey,
        value: z.infer<TMap[TKey]>
    ) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    removeItem(key: keyof TMap & string) {
        return localStorage.removeItem(key);
    }

    clear() {
        return localStorage.clear();
    }
}
