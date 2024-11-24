import { inject, Injectable, signal } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { GetSpotifySearch200TracksItemsItem } from "../../apiCodegen/backend";
import { toast } from "ngx-sonner";
import { SavedTracksTranslationService } from "./saved-tracks.translations";

export type Track = GetSpotifySearch200TracksItemsItem;

@Injectable({
    providedIn: "root",
})
export class SavedTracksService {
    private _localStorage = inject(LocalStorageService);
    public dict = inject(SavedTracksTranslationService).dict;

    private _tracks = signal(this._localStorage.getItem("trackCache") ?? []);
    public tracks = this._tracks.asReadonly();

    public push(track: Track) {
        const tracks = this._tracks();

        if (tracks.some(t => t.id === track.id)) {
            toast(this.dict().alreadyAdded);
            return;
        }

        if (tracks.length >= 50) {
            toast(this.dict().alreadyAdded);
            return;
        }

        tracks.push(track);
        this._tracks.set(tracks);
        this._localStorage.setItem("trackCache", this.tracks());
    }

    public remove(trackId: Track["id"]) {
        this._tracks.set(this.tracks().filter((t) => t.id !== trackId));
        this._localStorage.setItem("trackCache", this.tracks());
    }

    public clear() {
        this._tracks.set([]);
        this._localStorage.setItem("trackCache", this.tracks());
    }
}
