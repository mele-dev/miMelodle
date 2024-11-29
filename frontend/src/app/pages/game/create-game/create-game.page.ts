import { CommonModule, JsonPipe } from "@angular/common";
import { Component, computed, inject, signal } from "@angular/core";
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
import { TrackListItemComponent } from "../../../components/track-list-item/track-list-item.component";
import { TutorialsTranslator } from "../tutorials-dialog.translations";
import { GuessSongService } from "../../../services/games/guess-song.service";
import { GuessLineService } from "../../../services/games/guess-line.service";
import { SavedArtistsService } from "../../../services/saved-artists.service";
import { HlmDialogModule } from "@spartan-ng/ui-dialog-helm";
import { BrnDialogModule } from "@spartan-ng/ui-dialog-brain";
import { ArtistFinderComponent } from "../../../components/artist-finder/artist-finder.component";
import {
    SavedTracksService,
    Track,
} from "../../../services/saved-tracks.service";
import { HlmInputModule } from "@spartan-ng/ui-input-helm";
import { getSpotifySearch } from "../../../../apiCodegen/backend";
import { getSpotifySearchQueryPageSizeMax } from "../../../../apiCodegen/backend-zod";
import { FormsModule } from "@angular/forms";
import { SpotifyImagePickerService } from "../../../services/spotify-image-picker.service";

@Component({
    selector: "app-create-game",
    standalone: true,
    imports: [
        JsonPipe,
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
        HlmInputModule,
        FormsModule,
    ],
    providers: [provideIcons({ lucideArrowUpDown, lucidePlus })],
    templateUrl: "./create-game.page.html",
})
export class CreateGamePage {
    private _savedArtists = inject(SavedArtistsService);
    tracksService = inject(SavedTracksService);
    guessSong = inject(GuessSongService);
    guessLine = inject(GuessLineService);
    dict = inject(CreateGameTranslations).dict;
    dictT = inject(TutorialsTranslator).dict;
    imagePicker = inject(SpotifyImagePickerService);

    trackOptions = signal<Track[] | undefined>([]);

    filteredTrackOptions = computed(() => {
        const options = this.trackOptions();
        const savedTracks = this.tracksService.tracks();

        // TODO: Make the chosen track be taken out of the modal.
        return options?.filter((o) => {
            return !savedTracks.some((s) => {
                return s.id === o.id;
            });
        });
    });

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

    next() {
        this.selectedIndex.set(
            (this.selectedIndex() + 1) % this.titles().length
        );
    }

    removeArtist(artist: ArtistListItem) {
        this._savedArtists.deleteArtist(artist.id);
    }

    tracksQuery = signal("");

    async searchTracks() {
        this.trackOptions.set(undefined);

        const tracks = await getSpotifySearch({
            page: 0,
            pageSize: getSpotifySearchQueryPageSizeMax,
            query: this.tracksQuery(),
            spotifyQueryType: "track" as any,
        });

        this.trackOptions.set(tracks.data.tracks!.items);
    }

    keyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            this.searchTracks();
            return;
        }
    }

    async ngOnInit() {
        await this._savedArtists.loadData();
        this._savedArtists.loadData();
    }

    async submit() {
        if (this.selected().isLine) {
            return await this.guessLine.createGameFromTracks(
                this.tracksService.tracks().map((t) => t.id)
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
