import { CommonModule, JsonPipe } from "@angular/common";
import {
    Component,
    computed,
    ElementRef,
    inject,
    input,
    OnInit,
    signal,
    ViewChild,
} from "@angular/core";
import { z } from "zod";
import {
    getSpotifySearch,
    getUsersSelfSelfIdGameGuessSongGameId,
    GetUsersSelfSelfIdGameGuessSongGameIdResult,
} from "../../../../apiCodegen/backend";
import { SelfService } from "../../../services/self.service";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { provideIcons } from "@ng-icons/core";
import { lucideCheck, lucideX } from "@ng-icons/lucide";
import {
    WordleTextComponent,
    WordleTextInputSelection,
    WordleTextModifiers,
} from "../../../components/wordle-text/wordle-text.component";
import { FormsModule } from "@angular/forms";
import { toast } from "ngx-sonner";
import { getSpotifySearchQueryPageSizeMax } from "../../../../apiCodegen/backend-zod";

@Component({
    selector: "app-guess-song",
    standalone: true,
    imports: [
        JsonPipe,
        CommonModule,
        HlmIconModule,
        WordleTextComponent,
        FormsModule,
    ],
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

    value = signal<string>("");

    shownValue = computed(() => {
        let baseString = this.value();

        if (baseString.length === 0) {
            baseString = "Write your guess here!";
        }

        return baseString
            .split("")
            .map(
                (c) =>
                    ({ hint: "Wrong", char: c }) satisfies WordleTextModifiers
            );
    });

    computedAttempts = computed(() => {
        const info = this.gameInfo();
        const targetSize = (info?.attempts.length ?? 0) + 1;
        const output = Array(targetSize)
            .fill(null)
            .map((_, index) => {
                const attempt = this.gameInfo()?.attempts?.[index];
                if (attempt === undefined) {
                    return null;
                }
                return (
                    {
                        ...attempt,
                        guessedTrackNameHint: attempt.guessedTrackNameHint
                            .split("")
                            .map(
                                (c, i) =>
                                    ({
                                        char: attempt.guessedTrackName[i],
                                        hint: c === "_" ? "Wrong" : "Correct",
                                    }) satisfies WordleTextModifiers
                            ),
                    } ?? null
                );
            });
        console.log(output);
        return output;
    });

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

    @ViewChild("hiddenInput") hiddenInput!: ElementRef<HTMLInputElement>;
    selection: WordleTextInputSelection | undefined = undefined;
    focusInput() {
        this.hiddenInput.nativeElement.focus();
    }

    onInput() {
        const input = this.hiddenInput.nativeElement;
        this.selection = {
            start: input.selectionStart ?? -1,
            end: input.selectionEnd ?? -1,
        };
        console.log(input.selectionStart, input.selectionEnd);
    }

    keyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            this.searchForAttempt();
            return;
        }

        this.onInput();
    }

    async searchForAttempt() {
        const query = this.value();

        const result = await getSpotifySearch({
            query,
            page: 0,
            pageSize: getSpotifySearchQueryPageSizeMax,
            spotifyQueryType: "track" as any,
        });

        alert(JSON.stringify(result.data.tracks?.items.map(t => t.name)));
    }

    async ngOnInit() {
        const self = await this._self.waitForUserInfoSnapshot();
        try {
            const result = await getUsersSelfSelfIdGameGuessSongGameId(
                self.id,
                this.ids().gameId
            );

            this.gameInfo.set(result.data);
        } catch (e) {
            toast("There was an error while fetching game information.");
            console.error(e);
        }
    }
}
