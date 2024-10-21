import { z, ZodSchema } from "zod";

export type StorageMap = Record<string, ZodSchema>;
export abstract class AbstractStorageService<TMap extends StorageMap> {
    public abstract readonly storageMap: TMap;
    protected abstract readonly storage: Storage;

    getItem<TKey extends keyof TMap & string>(
        key: TKey
    ): z.infer<TMap[TKey]> | null {
        const storageValue = localStorage.getItem(key);

        if (storageValue === null) {
            return null;
        }

        try {
            const parsedJson = JSON.parse(storageValue);
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
        this.storage.setItem(key, JSON.stringify(value));
    }

    removeItem(key: keyof TMap & string) {
        return this.storage.removeItem(key);
    }

    clear() {
        return this.storage.clear();
    }
}
