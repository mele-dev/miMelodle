import { inject, Injectable, signal } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import { GetSpotifySearch200TracksItemsItem } from "../../apiCodegen/backend";

export type Track = GetSpotifySearch200TracksItemsItem;

@Injectable({
    providedIn: "root",
})
export class SavedTracksService {
    private _localStorage = inject(LocalStorageService);

    private _tracks = signal(this._localStorage.getItem("trackCache") ?? []);
    public tracks = this._tracks.asReadonly();

    public push(track: Track) {
        const tracks = this._tracks();
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
