import { Injectable } from "@angular/core";
import { z, ZodSchema } from "zod";
import { postAuthLoginResponse } from "../../apiCodegen/backend-zod";

export type LocalStorageMaps =
    typeof LocalStorageService.prototype.localStorageMaps;
export type localStorageKeys = keyof LocalStorageMaps;

@Injectable({
    providedIn: "root",
})
export class LocalStorageService {
    public readonly localStorageMaps = {
        userInfo: postAuthLoginResponse,
    } as const satisfies Record<string, ZodSchema>;

    getItem<TKey extends localStorageKeys>(
        key: TKey
    ): z.infer<LocalStorageMaps[TKey]> | null {
        const localStorageValue = localStorage.getItem(key);

        if (localStorageValue === null) {
            return null;
        }

        try {
            const parsedJson = JSON.parse(localStorageValue);
            const parsedZod = this.localStorageMaps[key].safeParse(parsedJson);

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

    setItem<TKey extends localStorageKeys>(
        key: TKey,
        value: z.infer<LocalStorageMaps[TKey]>
    ) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    removeItem(key: localStorageKeys) {
        return localStorage.removeItem(key);
    }

    clear() {
        return localStorage.clear();
    }
}
