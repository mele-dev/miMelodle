import { CommonModule } from "@angular/common";
import { Component, computed, inject, signal, ViewChild } from "@angular/core";
import { provideIcons } from "@ng-icons/core";
import { lucideArrowUpDown, lucidePlus } from "@ng-icons/lucide";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { HlmScrollAreaModule } from "@spartan-ng/ui-scrollarea-helm";
import { HlmSeparatorModule } from "@spartan-ng/ui-separator-helm";
import {
    ArtistListItem,
    ArtistListItemComponent,
} from "../../../components/artist-list-item/artist-list-item.component";
import { CrFancyButtonStylesDirective } from "../../../directives/styling/cr-fancy-button-styles.directive";
import { toast } from "ngx-sonner";
import { CreateGameTranslations } from "./create-game.translations";
import {
    TrackListItem,
    TrackListItemComponent,
} from "../../../components/track-list-item/track-list-item.component";
import { HlmDialogComponent } from "@spartan-ng/ui-dialog-helm";
import { TutorialsTranslator } from "../tutorials-dialog.translations";
import { GuessSongService } from "../../../services/games/guess-song.service";
import { GuessLineService } from "../../../services/games/guess-line.service";
import { SavedArtistsService } from "../../../services/saved-artists.service";
import {
    GetSpotifySearch200ArtistsItemsItem,
    GetSpotifySearch200TracksItemsItem,
} from "../../../../apiCodegen/backend";
import {
    HlmDialogModule,
} from "@spartan-ng/ui-dialog-helm";
import { BrnDialogModule } from "@spartan-ng/ui-dialog-brain";
import { ArtistFinderComponent } from "../../../components/artist-finder/artist-finder.component";

@Component({
    selector: "app-create-game",
    standalone: true,
    imports: [
        HlmSeparatorModule,
        CommonModule,
        HlmButtonModule,
        HlmIconModule,
        HlmScrollAreaModule,
        ArtistListItemComponent,
        CrFancyButtonStylesDirective,
        TrackListItemComponent,
        HlmDialogModule,
        BrnDialogModule,
        ArtistFinderComponent,
    ],
    providers: [provideIcons({ lucideArrowUpDown, lucidePlus })],
    templateUrl: "./create-game.page.html",
})
export class CreateGamePage{
    private _savedArtists = inject(SavedArtistsService);
    guessSong = inject(GuessSongService);
    guessLine = inject(GuessLineService);
    dict = inject(CreateGameTranslations).dict;
    dictT = inject(TutorialsTranslator).dict;
    @ViewChild("pickTrackDialog") pickTrackDialog!: HlmDialogComponent;
    readonly titles = computed(() => {
        return [this.dict().line, this.dict().song] as const;
    });

    private selectedIndex = signal(0);

    selected = computed(() => {
        const val = this.titles()[this.selectedIndex()];
        return {
            isLine: val == this.dict().line,
            isSong: val == this.dict().song,
        } as const;
    });

    artists = this._savedArtists.artists;
    tracks = signal<GetSpotifySearch200TracksItemsItem[]>([]);

    next() {
        this.selectedIndex.set(
            (this.selectedIndex() + 1) % this.titles().length
        );
    }

    removeArtist(artist: ArtistListItem) {
        this._savedArtists.deleteArtist(artist.id);
    }

    removeTrack(track: TrackListItem) {
        this.tracks.set(this.tracks().filter((t) => t.id !== track.id));
    }

    async ngOnInit() {
        await this._savedArtists.loadData();
        this._savedArtists.loadData();
    }

    async submit() {
        if (this.selected().isLine) {
            return await this.guessLine.createGameFromTracks(
                this.tracks().map((t) => t.id)
            );
        }

        if (this.selected().isSong) {
            return await this.guessSong.createGameFromArtists(
                this.artists().map((t) => t.id)
            );
        }

        toast(this.dict().TODOGamemode);
    }
}
