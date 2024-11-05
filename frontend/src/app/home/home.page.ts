import { Component } from "@angular/core";
import { UserFinderComponent } from "../components/user-finder/user-finder.component";
import {
    HlmButtonDirective,
} from "@spartan-ng/ui-button-helm";
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
import { CollectionArtistCardComponent } from "../components/artist-card/collection-artist-card.component";

@Component({
    selector: "app-home",
    standalone: true,
    imports: [
    UserFinderComponent,
    BrnDialogTriggerDirective,
    BrnDialogContentDirective,
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogHeaderComponent,
    HlmDialogFooterComponent,
    HlmDialogTitleDirective,
    HlmDialogDescriptionDirective,
    HlmLabelDirective,
    HlmInputDirective,
    HlmButtonDirective,
    CollectionArtistCardComponent
],
    templateUrl: "./home.page.html",
})
export class HomePage {}
