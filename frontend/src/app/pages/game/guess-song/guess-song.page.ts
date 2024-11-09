import { CommonModule, JsonPipe } from "@angular/common";
import {
    Component,
    computed,
    inject,
    input,
    OnInit,
    signal,
} from "@angular/core";
import { z } from "zod";
import {
    getUsersSelfSelfIdGameGuessSongGameId,
    GetUsersSelfSelfIdGameGuessSongGameIdResult,
} from "../../../../apiCodegen/backend";
import { SelfService } from "../../../services/self.service";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { provideIcons } from "@ng-icons/core";
import { lucideCheck, lucideX } from "@ng-icons/lucide";

@Component({
    selector: "app-guess-song",
    standalone: true,
    imports: [JsonPipe, CommonModule, HlmIconModule],
    providers: [provideIcons({ lucideCheck, lucideX })],
    templateUrl: "./guess-song.page.html",
})
export class GuessSongPage implements OnInit {
    readonly gameId = input.required<string>();
    private _self = inject(SelfService);
    ids = computed(() => {
        const schema = z.object({ gameId: z.coerce.number().positive() });
        const parsed = schema.safeParse({
            gameId: this.gameId(),
        });

        if (!parsed.success) {
            return { gameId: -Infinity };
        }

        return parsed.data;
    });

    gameInfo = signal<
        GetUsersSelfSelfIdGameGuessSongGameIdResult["data"] | undefined
    >(undefined);

    hasWon = computed(
        () => this.gameInfo()?.attempts.some((a) => a.isCorrectTrack) ?? false
    );

    artistsString = computed(() => {
        const info = this.gameInfo();
        if (info === undefined) {
            return undefined;
        }

        return info.artists.map((a) => a.name).join(", ");
    });

    hintHasCorrectSpots(hint: string) {
        return hint.split("").some((c) => c !== "_");
    }

    async ngOnInit() {
        const self = await this._self.waitForUserInfoSnapshot();
        try {
            const result = await getUsersSelfSelfIdGameGuessSongGameId(
                self.id,
                this.ids().gameId
            );
            const a = result.data.attempts[0].guessedTrackNameHint
                .split("")
                .some((a) => a !== "_");

            this.gameInfo.set(result.data);
        } catch (e) {
            console.error(e);
        }
    }
}
