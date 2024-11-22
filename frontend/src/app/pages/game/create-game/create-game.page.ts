import { CommonModule } from "@angular/common";
import { Component, computed, ElementRef, EventEmitter, inject, OnInit, Output, output, signal, ViewChild } from "@angular/core";
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
import {
    postUsersSelfSelfIdGameGuessLine,
    postUsersSelfSelfIdGameGuessSong,
} from "../../../../apiCodegen/backend";
import { SelfService } from "../../../services/self.service";
import { SafeRoutingService } from "../../../services/safe-routing.service";
import { isAxiosError } from "axios";
import { toast } from "ngx-sonner";
import { CreateGameTranslations } from "./create-game.translations";
import { hardCodedArtists } from "./hard-coded-artists";
import {
    TrackListItem,
    TrackListItemComponent,
} from "../../../components/track-list-item/track-list-item.component";
import { hardCodedTracks } from "./hard-coded-tracks";
import { HlmDialogComponent, HlmDialogContentComponent, HlmDialogHeaderComponent } from "@spartan-ng/ui-dialog-helm";
import { TutorialsTranslator } from "../tutorials-dialog.translations";

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
],
    providers: [provideIcons({ lucideArrowUpDown, lucidePlus })],
    templateUrl: "./create-game.page.html",
})
export class CreateGamePage{
    dict = inject(CreateGameTranslations).dict;
    dictT = inject(TutorialsTranslator).dict;
    readonly titles = computed(() => {
        return [this.dict().line, this.dict().song] as const;
    });

    private readonly _self = inject(SelfService);
    private readonly _router = inject(SafeRoutingService);
    private selectedIndex = signal(0);

    selected = computed(() => {
        const val = this.titles()[this.selectedIndex()];
        return {
            isLine: val == this.dict().line,
            isSong: val == this.dict().song,
        } as const;
    });

    artists = signal(hardCodedArtists);
    tracks = signal(hardCodedTracks);

    next() {
        this.selectedIndex.set(
            (this.selectedIndex() + 1) % this.titles().length
        );
    }

    removeArtist(artist: ArtistListItem) {
        this.artists.set(this.artists().filter((a) => a.id !== artist.id));
    }

    removeTrack(track: TrackListItem) {
        this.tracks.set(this.tracks().filter((t) => t.id !== track.id));
    }

    async createGameFromTracks(tracks: TrackListItem[]) {
        const user = await this._self.waitForUserInfoSnapshot();

        try {
            toast(this.dict().creatingGame);
            const result = await postUsersSelfSelfIdGameGuessLine(user.id, {
                fromTracks: tracks.map((t) => t.id),
            });
            toast(this.dict().gameCreated);
            return this._router.navigate("/app/game/guess_line/:gameId", {
                ids: result.data,
            });
        } catch (e) {
            if (isAxiosError(e)) {
                console.log(e.response?.data);
            } else {
                console.log(e);
            }

            toast(this.dict().errorWhileCreatingGame, {
                action: {
                    label: this.dict().retry,
                    onClick: () => this.createGameFromTracks(tracks),
                },
            });
        }
    }

    async createGameFromArtists(artists: ArtistListItem[]) {
        const user = await this._self.waitForUserInfoSnapshot();

        try {
            toast(this.dict().creatingGame);
            const result = await postUsersSelfSelfIdGameGuessSong(user.id, {
                fromArtists: artists.map((artist) => artist.id),
            });
            toast(this.dict().gameCreated);
            return this._router.navigate("/app/game/guess_song/:gameId", {
                ids: result.data,
            });
        } catch (e) {
            if (isAxiosError(e)) {
                console.log(e.response?.data);
            } else {
                console.log(e);
            }

            toast(this.dict().errorWhileCreatingGame, {
                action: {
                    label: this.dict().retry,
                    onClick: () => this.createGameFromArtists(artists),
                },
            });
        }
    }

    async submit() {
        if (this.selected().isLine) {
            return await this.createGameFromTracks(this.tracks());
        }

        if (this.selected().isSong) {
            return await this.createGameFromArtists(this.artists());
        }

        toast(this.dict().TODOGamemode);
    }

}
