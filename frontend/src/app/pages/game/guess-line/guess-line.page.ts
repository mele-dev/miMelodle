import {
    AfterViewInit,
    Component,
    computed,
    ElementRef,
    inject,
    input,
    OnInit,
    signal,
    ViewChild,
} from "@angular/core";
import { SelfService } from "../../../services/self.service";
import {
    getUsersSelfSelfIdGameGuessLineGameId,
    GetUsersSelfSelfIdGameGuessLineGameId200,
    postUsersSelfSelfIdGameGuessLineGameIdAttempts,
} from "../../../../apiCodegen/backend";
import { DomSanitizer } from "@angular/platform-browser";
import { SafeRoutingService } from "../../../services/safe-routing.service";
import { z } from "zod";
import { toast } from "ngx-sonner";
import { CommonModule, JsonPipe } from "@angular/common";
import { TrackListItemComponent } from "../../../components/track-list-item/track-list-item.component";
import { WordleTextComponent } from "../../../components/wordle-text/wordle-text.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HlmInputModule } from "@spartan-ng/ui-input-helm";
import { GuessLineWordleTextComponent } from "../../../components/guess-line-wordle-text/guess-line-wordle-text.component";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { GuessLineTranslator } from "./guess-line.translations";
import { SafePipe } from "../../../pipes/safe.pipe";
import { TutorialsTranslator } from "../tutorials-dialog.translations";

@Component({
    selector: "app-guess-line",
    standalone: true,
    imports: [
        JsonPipe,
        TrackListItemComponent,
        WordleTextComponent,
        ReactiveFormsModule,
        FormsModule,
        HlmInputModule,
        CommonModule,
        HlmButtonModule,
        GuessLineWordleTextComponent,
        SafePipe,
    ],
    templateUrl: "./guess-line.page.html",
})
export class GuessLinePage implements OnInit, AfterViewInit {
    readonly gameId = input.required<string>();
    private _self = inject(SelfService);
    sanitizer = inject(DomSanitizer);
    router = inject(SafeRoutingService);
    dict = inject(GuessLineTranslator).dict;
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

    // Use this to iterate six times in template.
    attemptIndexes = Array(6).fill(NaN);

    placeholder = signal("");

    gameInfo = signal<GetUsersSelfSelfIdGameGuessLineGameId200 | undefined>(
        undefined
    );

    hasWon = computed(() => {
        return this.gameInfo()?.attempts.some(
            (a) => !a.snippetHint.includes("~") && !a.snippetHint.includes("_")
        );
    });

    hasLost = computed(() => {
        const info = this.gameInfo();
        const hasWon = this.hasWon();

        if (!info) {
            return false;
        }

        return !hasWon && info.attempts.length >= 6;
    });

    hasEnded = computed(() => {
        return this.hasWon() || this.hasLost();
    });

    embedSrc = computed(() => {
        const info = this.gameInfo();

        if (info === undefined) {
            return undefined;
        }

        return `https://open.spotify.com/embed/track/${info.track.id}`;
    });

    transform(url: string) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

    async submitAttempt() {
        const self = await this._self.waitForUserInfoSnapshot();

        if (this.currentAttempt.length !== this.gameInfo()?.snippetLength) {
            toast(this.dict().writeFullLength);
            return;
        }

        const result = await postUsersSelfSelfIdGameGuessLineGameIdAttempts(
            self.id,
            this.ids().gameId,
            {
                guessedLine: this.currentAttempt,
            }
        );

        this.gameInfo.set(result);
    }

    get currentAttempt() {
        return this.attempts[this.gameInfo()?.attempts.length ?? 0];
    }

    attempts = Array(6)
        .fill(0)
        .map(() => "");

    isCurrentAttempt(i: number) {
        return this.gameInfo()!.attempts.length === i;
    }

    hint(attemptNumber: number) {
        return this.gameInfo()?.attempts?.at(attemptNumber);
    }

    async load() {
        const self = await this._self.waitForUserInfoSnapshot();
        try {
            const result = await getUsersSelfSelfIdGameGuessLineGameId(
                self.id,
                this.ids().gameId
            );

            this.placeholder.set(".".repeat(result.snippetLength));

            this.gameInfo.set(result);
        } catch (e) {
            toast(this.dict().errorFetchingInformation, {
                action: {
                    label: this.dict().retry,
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

    ngAfterViewInit(): void {
        this.dialog.nativeElement.showModal();
    }
}
