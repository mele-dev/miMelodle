import {
    Component,
    computed,
    ElementRef,
    inject,
    OnInit,
    QueryList,
    ViewChildren,
} from "@angular/core";
import { HomeArtistsService } from "../../services/saved-artists.service";
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
    public homeArtistsService = inject(HomeArtistsService);
    public guessSong = inject(GuessSongService);
    dict = inject(CollectionArtistCardTranslator).dict;
    @ViewChildren("dialog") dialogs!: QueryList<ElementRef>;
    safeRouter = inject(SafeRoutingService);

    public async ngOnInit() {
        await this.homeArtistsService.loadData();
    }

    public async delete(id: string) {
        this.closeDialog(id);
        await this.homeArtistsService.deleteArtist(id);
    }

    public async favorite(id: string) {
        await this.homeArtistsService.artistFavoriteToogle(id);
    }

    public favoriteArtists = computed(() => {
        return this.homeArtistsService.artists().filter((a) => a.isFavorite);
    });

    public openDialog(artistId: string) {
        const dialog = this.dialogs.find(
            (dialog) =>
                dialog.nativeElement.getAttribute("data-artist-id") === artistId
        );
        dialog?.nativeElement.showModal();
    }

    public closeDialog(artistId: string) {
        const dialog = this.dialogs.find(
            (dialog) =>
                dialog.nativeElement.getAttribute("data-artist-id") === artistId
        );
        dialog?.nativeElement.close();
    }
}
