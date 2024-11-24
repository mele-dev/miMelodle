import { inject, Injectable, signal } from "@angular/core";
import {
    deleteUsersSelfSelfIdArtistsSpotifyArtistId,
    getUsersSelfSelfIdArtists,
    GetUsersSelfSelfIdArtists200Item,
    putUsersSelfSelfIdArtistsSpotifyArtistIdFavorite,
} from "../../apiCodegen/backend";
import { SelfService } from "./self.service";
import { toast } from "ngx-sonner";
import { isAxiosError } from "axios";
import { CollectionArtistCardTranslator } from "../components/collection-artist-card/collection-artist-card.translations";

export type Artist = GetUsersSelfSelfIdArtists200Item;

@Injectable({
    providedIn: "root",
})
export class SavedArtistsService {
    private _artists = signal<Artist[]>([]);
    dict = inject(CollectionArtistCardTranslator).dict;
    public artists = this._artists.asReadonly();
    private _selfService = inject(SelfService);

    public async loadData() {
        const userId = (await this._selfService.waitForUserInfoSnapshot()).id;

        if (userId === undefined) {
            return;
        }

        const data = await getUsersSelfSelfIdArtists(userId);

        this._artists.set(data.data);
    }

    public async deleteArtist(artistsId: string) {
        const userId = (await this._selfService.waitForUserInfoSnapshot()).id;

        if (userId === undefined) {
            return;
        }

        const result = await deleteUsersSelfSelfIdArtistsSpotifyArtistId(
            userId,
            artistsId
        );

        await this.loadData();
    }

    public async artistFavoriteToogle(artistsId: string) {
        const userId = (await this._selfService.waitForUserInfoSnapshot()).id;
        if (userId === undefined) {
            return;
        }

        const artist = this._artists().find((a) => {
            return a.id === artistsId;
        });

        try {
            if (artist!.isFavorite) {
                await putUsersSelfSelfIdArtistsSpotifyArtistIdFavorite(
                    userId,
                    artistsId,
                    { isFavorite: false }
                );
            } else {
                await putUsersSelfSelfIdArtistsSpotifyArtistIdFavorite(
                    userId,
                    artistsId,
                    { isFavorite: true }
                );
            }
        } catch (e) {
            if (isAxiosError(e)) {
                toast(this.dict().backendError);
            }
        }

        await this.loadData();
    }

    public async addNewArtist(artists: GetUsersSelfSelfIdArtists200Item[]) {
        this._artists.set(artists as Artist[]);
    }
}
