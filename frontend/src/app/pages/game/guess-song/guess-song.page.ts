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
    GetSpotifySearch200,
    GetSpotifySearch200TracksItemsItem,
    getUsersSelfSelfIdGameGuessSongGameId,
    GetUsersSelfSelfIdGameGuessSongGameIdResult,
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
import { SafeRoutingService } from "../../../services/safe-routing.service";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { DomSanitizer } from "@angular/platform-browser";
import { SafePipe } from "../../../pipes/safe.pipe";
import { TutorialsTranslator } from "../tutorials-dialog.translations";

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
        HlmButtonModule,
        SafePipe,
    ],
    providers: [provideIcons({ lucideCheck, lucideX })],
    templateUrl: "./guess-song.page.html",
})
export class GuessSongPage implements OnInit {
    readonly gameId = input.required<string>();
    private _self = inject(SelfService);
    sanitizer = inject(DomSanitizer);
    router = inject(SafeRoutingService);
    dict = inject(GuessSongTranslator).dict;
    dictT = inject(TutorialsTranslator).dict;
    @ViewChild("tutorial") dialog!: ElementRef<HTMLDialogElement>;

    blurOn: boolean = true;
    public closeDialog() {
        this.dialog.nativeElement.close();
        this.blurOn = false;
    }
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
                                    char: attempt.guessedTrack.name[i],
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

    hasLost = computed(() => {
        const info = this.gameInfo();
        const hasWon = this.hasWon();

        if (info == undefined) {
            return false;
        }

        return info.attempts.length >= 6 && !hasWon;
    });

    embedSrc = computed(() => {
        const info = this.gameInfo();
        if (info?.correctTrack === undefined) {
            return undefined;
        }

        return `https://open.spotify.com/embed/track/${info.correctTrack.id}?utm_source=generator`;
    });

    hasEnded = computed(() => this.hasLost() || this.hasWon());

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

        this.gameInfo.set(result.data);

        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth", 
        });

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
            toast(this.dict().gameInfoError);
            console.error(e);
        }
    }

    async ngOnInit() {
        await this.load();
        this.dialog.nativeElement.showModal();
    }
}
