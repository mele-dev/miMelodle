import {
    Component,
    computed,
    inject,
    input,
    OnInit,
    signal,
} from "@angular/core";
import { SelfService } from "../../../services/self.service";
import {
    getUsersSelfSelfIdGameGuessLineGameId,
    GetUsersSelfSelfIdGameGuessLineGameId200,
} from "../../../../apiCodegen/backend";
import { DomSanitizer } from "@angular/platform-browser";
import { SafeRoutingService } from "../../../services/safe-routing.service";
import { GuessSongTranslator } from "../guess-song/guess-song.translations";
import { z } from "zod";
import { toast } from "ngx-sonner";
import { JsonPipe } from "@angular/common";
import { TrackListItemComponent } from "../../../components/track-list-item/track-list-item.component";
import {
    WordleTextComponent,
    WordleTextModifiers,
} from "../../../components/wordle-text/wordle-text.component";

@Component({
    selector: "app-guess-line",
    standalone: true,
    imports: [JsonPipe, TrackListItemComponent, WordleTextComponent],
    templateUrl: "./guess-line.page.html",
})
export class GuessLinePage implements OnInit {
    readonly gameId = input.required<string>();
    private _self = inject(SelfService);
    sanitizer = inject(DomSanitizer);
    router = inject(SafeRoutingService);
    dict = inject(GuessSongTranslator).dict;
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

    // Use this to iterate six times in template.
    attemptIndexes = Array(6).fill(NaN);

    gameInfo = signal<GetUsersSelfSelfIdGameGuessLineGameId200 | undefined>(
        undefined
    );

    placeholderText = computed(() => {
        const info = this.gameInfo();

        if (!info) {
            return undefined;
        }

        return Array(info.snippetLength)
            .fill({
                hint: "Wrong",
                char: "-",
            } satisfies WordleTextModifiers);
    });

    async load() {
        const self = await this._self.waitForUserInfoSnapshot();
        try {
            const result = await getUsersSelfSelfIdGameGuessLineGameId(
                self.id,
                this.ids().gameId
            );

            this.gameInfo.set(result.data);
        } catch (e) {
            toast("There was an error while fetching game information.", {
                action: {
                    label: "Retry",
                    onClick: () => this.load(),
                },
                duration: Infinity,
                closeButton: true,
            });
            console.error(e);
        }
    }

    async ngOnInit() {
        await this.load();
    }
}
