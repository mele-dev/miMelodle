import {
    Component,
    inject,
    signal,
} from "@angular/core";
import {
    getSpotifySearch,
    GetSpotifySearch200Artists,
    postUsersSelfSelfIdArtistsSpotifyArtistId,
} from "../../../apiCodegen/backend";
import { toast } from "ngx-sonner";
import { HlmTableComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-table.component";
import { HlmTrowComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-trow.component";
import { HlmTdComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-td.component";
import { FormsModule } from "@angular/forms";
import { SavedArtistsService } from "../../services/saved-artists.service";
import { ArtistFinderTranslator } from "./artist-finder.translations";
import { SelfService } from "../../services/self.service";
import { HlmInputModule } from "@spartan-ng/ui-input-helm";
import { JsonPipe } from "@angular/common";
import { SpotifyImagePickerService } from "../../services/spotify-image-picker.service";

type SearchedArtist = GetSpotifySearch200Artists["items"][number];

@Component({
    selector: "app-artist-finder",
    standalone: true,
    imports: [
        JsonPipe,
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
    imagePicker = inject(SpotifyImagePickerService);

    async search() {
        try {
            const query = await getSpotifySearch({
                page: 0,
                pageSize: 50,
                query: this.usersFilter(),
                spotifyQueryType: "artist" as any, // TODO CRIS
            });
            this.matchedArtists.set(query.artists?.items ?? []);
            this.matchedArtists.set(query.artists?.items ?? []);
            console.log(this.matchedArtists());
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
