import { Component, computed, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { HomeArtistsService } from "../../services/home-artists.service";
import { HlmScrollAreaComponent } from "@spartan-ng/ui-scrollarea-helm";
import { lucideMusic, lucideStar, lucideStarOff } from "@ng-icons/lucide";
import { provideIcons } from "@ng-icons/core";
import { HlmIconComponent } from "../../../../libs/ui/ui-icon-helm/src/lib/hlm-icon.component";
import { CommonModule } from "@angular/common";
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogDescriptionDirective, HlmDialogFooterComponent, HlmDialogHeaderComponent, HlmDialogModule, HlmDialogTitleDirective } from "@spartan-ng/ui-dialog-helm";
import { CollectionArtistCardTranslator } from "./collection-artist-card.translations";

@Component({
    selector: "app-collection-artist-card",
    standalone: true,
    imports: [HlmScrollAreaComponent, HlmIconComponent, CommonModule], 
    providers: [provideIcons({ lucideMusic, lucideStar, lucideStarOff })],
    templateUrl: "./collection-artist-card.component.html",
})
export class CollectionArtistCardComponent implements OnInit {
    public homeArtistsService = inject(HomeArtistsService);
    dict = inject(CollectionArtistCardTranslator).dict;
    @ViewChild('myDialog') dialog: ElementRef<HTMLDialogElement> | undefined;

    public async ngOnInit() {
        await this.homeArtistsService.loadData();
    }

    public async delete(id: string) {
        this.closeDialog();
        await this.homeArtistsService.deleteArtist(id);
    }

    public async favorite(id: string, favorite: boolean) {
        await this.homeArtistsService.setArtistToFavorite(id, favorite);
    }

    public favoriteArtists = computed(() => {
        return this.homeArtistsService.artists().filter((a) => a.isFavorite);
    });

    public openDialog(){
        this.dialog!.nativeElement.showModal();

    }

    public closeDialog(){
        this.dialog!.nativeElement.close();
    }

    public formatNumber(num:number) {
        const suffixes = { M: 1_000_000, K: 1_000 };
    
        for (const suffix in suffixes) {
            const value = suffixes[suffix as keyof typeof suffixes];
            if (num >= value) {
                return (num / value).toFixed(1).replace(/\.0$/, '') + suffix;
            }
        }
    
        return num.toString();
    }

    onClick() {
        // logica para comenzar el juego (llamar al endpoint)
    }
}
