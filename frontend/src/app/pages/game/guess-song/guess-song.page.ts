import { CommonModule, JsonPipe } from "@angular/common";
import {
    Component,
    computed,
    ElementRef,
    inject,
    input,
    OnInit,
    signal,
    TemplateRef,
    ViewChild,
} from "@angular/core";
import { z } from "zod";
import {
    getSpotifySearch,
    GetSpotifySearch200,
    GetSpotifySearch200TracksItemsItem,
    getUsersSelfSelfIdGameGuessSongGameId,
    GetUsersSelfSelfIdGameGuessSongGameIdResult,
    postUsersSelfSelfIdGameGuessSong,
    postUsersSelfSelfIdGameGuessSongGameIdAttempts,
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
import {
    HlmDialogComponent,
    HlmDialogModule,
} from "@spartan-ng/ui-dialog-helm";
import { BrnDialogModule } from "@spartan-ng/ui-dialog-brain";
import { GuessSongTranslator } from "./guess-song.translations";
import { HlmScrollAreaModule } from "@spartan-ng/ui-scrollarea-helm";

@Component({
    selector: "app-guess-song",
    standalone: true,
    imports: [
        JsonPipe,
        CommonModule,
        HlmIconModule,
        WordleTextComponent,
        FormsModule,
        BrnDialogModule,
        HlmDialogModule,
        HlmScrollAreaModule,
    ],
    providers: [provideIcons({ lucideCheck, lucideX })],
    templateUrl: "./guess-song.page.html",
})
export class GuessSongPage implements OnInit {
    readonly gameId = input.required<string>();
    private _self = inject(SelfService);
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
        const output = this.gameInfo()?.attempts.map((attempt) => {
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
    }

    keyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            this.searchForAttempt();
            return;
        }

        this.onInput();
    }

    trackOptions = signal<GetSpotifySearch200["tracks"]>(undefined);

    @ViewChild("pickTrackDialog")
    trackSelectionDialog!: HlmDialogComponent;

    async searchForAttempt() {
        const query = this.value();

        this.trackOptions.set(undefined);
        this.trackSelectionDialog.open();

        const result = await getSpotifySearch({
            // TODO: Check how to filter query properly.
            query: `${query} artist:${this.gameInfo()?.artists[0].name}`,
            page: 0,
            pageSize: getSpotifySearchQueryPageSizeMax,
            spotifyQueryType: "track" as any,
        });

        this.trackOptions.set(result.data.tracks);
    }

    async submitAttempt(track: GetSpotifySearch200TracksItemsItem) {
        this.trackSelectionDialog.close("Idk why I have to pass sth");
        const self = await this._self.waitForUserInfoSnapshot();

        const result = await postUsersSelfSelfIdGameGuessSongGameIdAttempts(
            self.id,
            this.ids().gameId,
            {
                guessedTrackSpotifyId: track.id,
            }
        );

        this.load();
    }

    async load() {
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

    async ngOnInit() {
        await this.load();
    }
}
