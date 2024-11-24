import {
    Component,
    effect,
    EventEmitter,
    inject,
    Output,
    signal,
} from "@angular/core";
import { TranslatorService } from "../../services/translator.service";
import { getFollowed, GetFollowedType } from "../../../apiCodegen/spotify";
import {
    getSpotifySearch,
    GetSpotifySearch200Artists,
    postUsersSelfSelfIdArtistsSpotifyArtistId,
} from "../../../apiCodegen/backend";
import { getSpotifySearchResponse } from "../../../apiCodegen/backend-zod";
import { toast } from "ngx-sonner";
import { HlmTableComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-table.component";
import { HlmTrowComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-trow.component";
import { HlmTdComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-td.component";
import { FormsModule } from "@angular/forms";
import { LocalStorageService } from "../../services/local-storage.service";
import { SavedArtistsService } from "../../services/saved-artists.service";
import { ArtistFinderTranslator } from "./artist-finder.translations";
import { SelfService } from "../../services/self.service";
import { HlmInputModule } from "@spartan-ng/ui-input-helm";

type SearchedArtist = GetSpotifySearch200Artists["items"][number];

@Component({
    selector: "app-artist-finder",
    standalone: true,
    imports: [
        HlmTableComponent,
        HlmTrowComponent,
        HlmTdComponent,
        FormsModule,
        HlmInputModule,
    ],
    templateUrl: "./artist-finder.component.html",
})
export class ArtistFinderComponent {
    dict = inject(ArtistFinderTranslator).dict;
    usersFilter = signal<string>("");
    matchedArtists = signal<SearchedArtist[]>([]);
    private _selfService = inject(SelfService);
    public homeArtistsService = inject(SavedArtistsService);

    async search() {
        console.info(this.usersFilter());
        try {
            const query = await getSpotifySearch({
                page: 0,
                pageSize: 50,
                query: this.usersFilter(),
                spotifyQueryType: "artist" as any, // TODO CRIS
            });
            this.matchedArtists.set(query.data.artists?.items ?? []);
        } catch (e) {
            toast(this.dict().artistsNotFound);
            return;
        }
    }

    public async addArtist(spotifyId: string) {
        const userId = (await this._selfService.waitForUserInfoSnapshot()).id;

        if (userId === undefined) {
            return;
        }

        try {
            const result = await postUsersSelfSelfIdArtistsSpotifyArtistId(
                userId,
                spotifyId
            );
            toast(this.dict().successToast);

            await this.homeArtistsService.loadData();
        } catch (e) {
            toast(this.dict().errorToast);
            return;
        }
    }
}
