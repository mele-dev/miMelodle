import { Component, inject, input, output } from "@angular/core";
import { GetSpotifySearch200TracksItemsItem } from "../../../apiCodegen/backend";
import { TrackListItemTranslator } from "./track-list-item.translator";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import {
    lucidePlay,
    lucideTarget,
    lucideX,
    lucideXSquare,
} from "@ng-icons/lucide";
import { provideIcons } from "@ng-icons/core";

export type TrackListItem = GetSpotifySearch200TracksItemsItem;

@Component({
    selector: "app-track-list-item",
    standalone: true,
    imports: [HlmButtonModule, HlmIconModule],
    providers: [
        provideIcons({ lucideXSquare, lucideX, lucideTarget, lucidePlay }),
    ],
    templateUrl: "./track-list-item.component.html",
})
export class TrackListItemComponent {
    track = input.required<TrackListItem>();
    dict = inject(TrackListItemTranslator).dict;
    destroy = output<TrackListItem>();
    play = output<TrackListItem>();
    readonly = input(false);
}
