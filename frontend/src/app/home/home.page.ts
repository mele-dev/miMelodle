import { Component, inject } from "@angular/core";
import {
    HlmDialogComponent,
    HlmDialogContentComponent,
} from "@spartan-ng/ui-dialog-helm";
import {
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
} from "@spartan-ng/ui-dialog-brain";
import { ArtistFinderComponent } from "../components/artist-finder/artist-finder.component";
import { CollectionArtistCardComponent } from "../components/collection-artist-card/collection-artist-card.component";
import { PlusComponent } from "../icons/plus/plus.component";
import { HomePageTranslator } from "./home-page.tanslations";
import { SelfService } from "../services/self.service";
import { getUsersSelfSelfIdArtists } from "../../apiCodegen/backend";
import { isAxiosError } from "axios";
import { GuessSongService } from "../services/games/guess-song.service";

@Component({
    selector: "app-home",
    standalone: true,
    imports: [
        ArtistFinderComponent,
        BrnDialogTriggerDirective,
        BrnDialogContentDirective,
        HlmDialogComponent,
        HlmDialogContentComponent,
        ArtistFinderComponent,
        CollectionArtistCardComponent,
        PlusComponent,
    ],
    templateUrl: "./home.page.html",
})
export class HomePage {
    dict = inject(HomePageTranslator).dict;
    public selfService = inject(SelfService);
    public name: string | undefined;

    isEmpty: boolean | undefined;

    ngOnInit() {
        this.getUsername();
        this.isItEmpty();
    }

    public async isItEmpty() {
        const userId = (await this.selfService.waitForUserInfoSnapshot()).id;
        try {
            const result = await getUsersSelfSelfIdArtists(userId);
            this.isEmpty = false;
        } catch (e) {
            if (isAxiosError(e)) {
                if (e.status == 404) {
                    this.isEmpty = true;
                }
            }
        }
    }

    public async getUsername() {
        const usersName = await (
            await this.selfService.waitForUserInfoSnapshot()
        ).name;
        this.name = usersName;
    }
}
