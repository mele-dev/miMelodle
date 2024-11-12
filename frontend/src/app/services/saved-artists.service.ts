import { inject, Injectable, signal } from "@angular/core";
import { LocalStorageService } from "./local-storage.service";
import {
    deleteUsersSelfSelfIdArtistsSpotifyArtistId,
    getUsersSelfSelfIdArtists,
    GetUsersSelfSelfIdArtists200Item,
    GetUsersSelfSelfIdArtists200ItemData,
    putUsersSelfSelfIdArtistsSpotifyArtistIdFavorite,
} from "../../apiCodegen/backend";
import { SelfService } from "./self.service";
import { boolean } from "zod";
import { toast } from "ngx-sonner";
import { isAxiosError } from "axios";
import { JsonPipe } from "@angular/common";
import { getFollowed } from "../../apiCodegen/spotify";

export type Artist = GetUsersSelfSelfIdArtists200Item;

@Injectable({
    providedIn: "root",
})
export class HomeArtistsService {
    private _artists = signal<Artist[]>([]);

    public artists = this._artists.asReadonly();
    private _localStorage = inject(LocalStorageService);

    public async loadData() {
        const userId = this._localStorage.getItem("userInfo")?.id;

        if (userId === undefined) {
            return;
        }

        const data = await getUsersSelfSelfIdArtists(userId);

        this._artists.set(data.data as Artist[]);
    }

    public async deleteArtist(artistsId: string) {
        const userId = this._localStorage.getItem("userInfo")?.id;

        if (userId === undefined) {
            return;
        }

        const result = await deleteUsersSelfSelfIdArtistsSpotifyArtistId(
            userId,
            artistsId
        );

        await this.loadData()
    }

    public async setArtistToFavorite(artistsId: string, isIt: boolean) {
        const userId = this._localStorage.getItem("userInfo")?.id;
        if (userId === undefined) {
            return;
        }

        try{
            console.log('here')
            const result =await  putUsersSelfSelfIdArtistsSpotifyArtistIdFavorite(
                userId,
                artistsId,
                { isFavorite: isIt }
            );
            console.log(result)
        } catch(e){
            console.error(e)
            console.log(isAxiosError(e))

            if(isAxiosError(e)){
                console.log(e.message)
                toast(e.message)
            }
        }

        
        
        await this.loadData()
    }

    public async addNewArtist(artists : GetUsersSelfSelfIdArtists200Item[]) {
        this._artists.set(artists as Artist[])
    }

    public formatNumber(num: number) {
        const suffixes = { M: 1_000_000, K: 1_000 };

        for (const suffix in suffixes) {
            const value = suffixes[suffix as keyof typeof suffixes];
            if (num >= value) {
                return (num / value).toFixed(1).replace(/\.0$/, "") + suffix;
            }
        }

        return num.toString();
    }
}
