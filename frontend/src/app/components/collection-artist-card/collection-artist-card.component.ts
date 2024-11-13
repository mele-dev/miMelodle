import {
    Component,
    computed,
    ElementRef,
    inject,
    OnInit,
    QueryList,
    ViewChild,
    ViewChildren,
} from "@angular/core";
import { HomeArtistsService } from "../../services/saved-artists.service";
import { HlmScrollAreaComponent } from "@spartan-ng/ui-scrollarea-helm";
import { lucideMusic, lucideStar, lucideStarOff } from "@ng-icons/lucide";
import { provideIcons } from "@ng-icons/core";
import { CommonModule } from "@angular/common";
import { CollectionArtistCardTranslator } from "./collection-artist-card.translations";

@Component({
    selector: "app-collection-artist-card",
    standalone: true,
    imports: [CommonModule],
    providers: [provideIcons({ lucideMusic, lucideStar, lucideStarOff })],
    templateUrl: "./collection-artist-card.component.html",
})
export class CollectionArtistCardComponent implements OnInit {
    public homeArtistsService = inject(HomeArtistsService);
    dict = inject(CollectionArtistCardTranslator).dict;
    @ViewChildren('dialog') dialogs!: QueryList<ElementRef>;

    public async ngOnInit() {
        await this.homeArtistsService.loadData();
    }

    public async delete(id: string) {
        this.closeDialog(id);
        await this.homeArtistsService.deleteArtist(id);
    }

    public async favorite(id: string, favorite: boolean) {
        await this.homeArtistsService.setArtistToFavorite(id, favorite);
    }

    public favoriteArtists = computed(() => {
        return this.homeArtistsService.artists().filter((a) => a.isFavorite);
    });

    public openDialog(artistId : string) {
        const dialog = this.dialogs.find(
            (dialog) => dialog.nativeElement.getAttribute('data-artist-id') === artistId
        );
        dialog?.nativeElement.showModal();
    }

    public closeDialog(artistId : string) {
        const dialog = this.dialogs.find(
            (dialog) => dialog.nativeElement.getAttribute('data-artist-id') === artistId
        );
        dialog?.nativeElement.close();
    }

    onClick() {
        // logica para comenzar el juego (llamar al endpoint)
    }
}
