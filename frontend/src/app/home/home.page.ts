import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { UserFinderComponent } from "../components/user-finder/user-finder.component";
import { HlmButtonDirective } from "@spartan-ng/ui-button-helm";
import {
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
} from "@spartan-ng/ui-dialog-helm";
import {
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
} from "@spartan-ng/ui-dialog-brain";
import { HlmLabelDirective } from "@spartan-ng/ui-label-helm";
import { HlmInputDirective } from "@spartan-ng/ui-input-helm";
import { ArtistFinderComponent } from "../components/artist-finder/artist-finder.component";
import { CollectionArtistCardComponent } from "../components/collection-artist-card/collection-artist-card.component";
import { PlusComponent } from "../icons/plus/plus.component";
import { HomePageTranslator } from "./home-page.tanslations";
import { boolean } from "zod";
import { SelfService } from "../services/self.service";
import { collectionArtistCardDict } from "../components/collection-artist-card/collection-artist-card.translations";
import { HomeArtistsService } from "../services/saved-artists.service";
import { getUsersSelfSelfIdArtists } from "../../apiCodegen/backend";
import { isAxiosError } from "axios";

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
        this.isEmptyy();
    }

    public async isEmptyy() {
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
