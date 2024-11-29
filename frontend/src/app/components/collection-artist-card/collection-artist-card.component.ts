import {
    Component,
    computed,
    inject,
    OnInit,
} from "@angular/core";
import { SavedArtistsService } from "../../services/saved-artists.service";
import {
    lucideMusic,
    lucidePlay,
    lucideStar,
    lucideStarOff,
} from "@ng-icons/lucide";
import { provideIcons } from "@ng-icons/core";
import { CommonModule } from "@angular/common";
import { CollectionArtistCardTranslator } from "./collection-artist-card.translations";
import { MusicComponent } from "../../icons/music/music.component";
import { XComponent } from "../../icons/x/x.component";
import { SafeRoutingService } from "../../services/safe-routing.service";
import { RouterLink } from "@angular/router";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { GuessSongService } from "../../services/games/guess-song.service";
import { SpotifyImagePickerService } from "../../services/spotify-image-picker.service";

@Component({
    selector: "app-collection-artist-card",
    standalone: true,
    imports: [CommonModule, MusicComponent, XComponent, RouterLink, HlmIconModule],
    providers: [
        provideIcons({ lucideMusic, lucideStar, lucideStarOff, lucidePlay }),
    ],
    templateUrl: "./collection-artist-card.component.html",
})
export class CollectionArtistCardComponent implements OnInit {
    imagePicker = inject(SpotifyImagePickerService);
    public homeArtistsService = inject(SavedArtistsService);
    public guessSong = inject(GuessSongService);
    dict = inject(CollectionArtistCardTranslator).dict;
    safeRouter = inject(SafeRoutingService);

    public async ngOnInit() {
        await this.homeArtistsService.loadData();
    }

    public async delete(id: string) {
        await this.homeArtistsService.deleteArtist(id);
    }

    public async favorite(id: string) {
        await this.homeArtistsService.artistFavoriteToogle(id);
    }

    public favoriteArtists = computed(() => {
        return this.homeArtistsService.artists().filter((a) => a.isFavorite);
    });

}
