import { Injectable } from "@angular/core";
import {
    getPublicIcons,
    getPublicIconsFilename,
} from "../../apiCodegen/backend";

@Injectable({
    providedIn: "root",
})
export class IconCacheService {
    private _icons: Record<string, string> = {};

    public async getProfilePicture(filename: string): Promise<string | null> {
        try {
            if (this._icons[filename]) {
                return this._icons[filename];
            }

            const result = await getPublicIconsFilename(filename);

            this._icons[filename] = await result.data.text();
            return this._icons[filename];
        } catch (e) {
            console.error("Error while getting icon:", e);
            return null;
        }
    }

    constructor() {}
}
