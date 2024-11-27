import {
    Component,
    computed,
    effect,
    inject,
    OnInit,
    signal,
} from "@angular/core";
import {
    LeaderboardFilter,
    LeaderboardsService,
} from "../../services/leaderboards.service";
import { TrophyComponent } from "../../icons/trophy/trophy.component";
import { CommonModule, JsonPipe } from "@angular/common";
import { HlmIconComponent } from "../../../../libs/ui/ui-icon-helm/src/lib/hlm-icon.component";
import { LeaderboardTranslator } from "./leaderboard.translations";
import { provideIcons } from "@ng-icons/core";
import { lucideChevronLeft, lucideChevronRight } from "@ng-icons/lucide";
import { ActivatedRoute, ActivationEnd, RouterLink } from "@angular/router";
import {
    GetLeaderboardsGameMode200,
    GetLeaderboardsGameMode200LeaderboardItem,
} from "../../../apiCodegen/backend";
import { HlmTabsModule } from "@spartan-ng/ui-tabs-helm";
import { LeaderboardTableComponent } from "../leaderboard-table/leaderboard-table.component";
import { HlmSwitchComponent } from "../../../../libs/ui/ui-switch-helm/src/lib/hlm-switch.component";
import { HlmLabelDirective } from "@spartan-ng/ui-label-helm";
import {
    HlmToggleDirective,
    HlmToggleModule,
} from "@spartan-ng/ui-toggle-helm";
import { BrnToggleDirective } from "@spartan-ng/ui-toggle-brain";
import { HlmTableModule } from "@spartan-ng/ui-table-helm";
import { toast } from "ngx-sonner";
import { HlmPaginationModule } from "@spartan-ng/ui-pagination-helm";
import { FormsModule } from "@angular/forms";
import { HlmSelectModule } from "@spartan-ng/ui-select-helm";
import { BrnSelectModule } from "@spartan-ng/ui-select-brain";
import {
    PopdleQueryParams,
    QueryParamsService,
} from "../../services/query-params.service";
import { SafeRoutingService } from "../../services/safe-routing.service";
import { PopdleGameMode } from "../../globalConstants";

@Component({
    selector: "app-leaderboard",
    standalone: true,
    imports: [
        HlmTableModule,
        TrophyComponent,
        CommonModule,
        HlmIconComponent,
        RouterLink,
        HlmTabsModule,
        LeaderboardTableComponent,
        HlmSwitchComponent,
        HlmLabelDirective,
        HlmToggleDirective,
        BrnToggleDirective,
        JsonPipe,
        HlmPaginationModule,
        HlmToggleModule,
        HlmSelectModule,
        BrnSelectModule,
        FormsModule,
    ],
    providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],
    templateUrl: "./leaderboard.component.html",
})
export class LeaderboardComponent implements OnInit {
    private _queryParams = inject(QueryParamsService);
    private _router = inject(SafeRoutingService);

    filters = signal<LeaderboardFilter & { filterFriends: boolean }>({
        gameMode: "guessLine",
        page: 1,
        pageSize: 50,
        filterFriends: false,
    });

    public leaderboard = signal<GetLeaderboardsGameMode200 | undefined>(
        undefined
    );

    dict = inject(LeaderboardTranslator).dict;

    private _leaderboardService = inject(LeaderboardsService);

    async ngOnInit() {
        const coerced = await this._queryParams.getCoercedSnapshot([
            "page",
            "filterFriends",
            "gameMode",
        ]);

        if (coerced.success) {
            console.log(coerced);
            this.filters.set({
                ...this.filters(),
                ...coerced.data,
            });
            this.loadLeaderboardInformation(coerced.data);
        }
    }

    navigationPages = computed(() => {
        const leaderboard = this.leaderboard();
        const page = this.filters().page;

        if (leaderboard === undefined) {
            return undefined;
        }

        const range = Array(5)
            .fill(1)
            .map((_, index) => {
                return index + page - 2;
            })
            .filter(p => p > 0 && p <= leaderboard.totalPages)
        ;

        return range;
    });

    changePage(page: number) {
        this.filters.set({
            ...this.filters(),
            page: page,
        })
        this._router.navigate("/app/leaderboards", {
            queryParams: this.filters() satisfies Partial<PopdleQueryParams>,
        });
        this.loadLeaderboardInformation(this.filters());
    }

    changeGameMode(gameMode: PopdleGameMode) {
        this.filters.set({
            ...this.filters(),
            gameMode,
            page: 1
        });
        this._router.navigate("/app/leaderboards", {
            queryParams: this.filters() satisfies Partial<PopdleQueryParams>,
        });
        this.loadLeaderboardInformation(this.filters());
    }

    toggleFriendsFilter() {
        this.filters.set({
            ...this.filters(),
            filterFriends: !this.filters().filterFriends,
            page: 1
        });
        this._router.navigate("/app/leaderboards", {
            queryParams: this.filters() satisfies Partial<PopdleQueryParams>,
        });
        this.loadLeaderboardInformation(this.filters());
    }

    async loadLeaderboardInformation(opts: {
        page?: number;
        gameMode?: PopdleGameMode;
        filterFriends?: boolean;
    }) {
        try {
            const transformedOpts = {
                page: (opts?.page ?? 1) - 1,
                pageSize: 50,
                gameMode: opts?.gameMode ?? "guessLine",
            } as const;

            const leaderboard = opts?.filterFriends
                ? await this._leaderboardService.getFriendsLeaderboard(
                      transformedOpts
                  )
                : await this._leaderboardService.getLeaderboard(
                      transformedOpts
                  );
            this.leaderboard.set(leaderboard!);
            return;
        } catch (e) {
            toast(this.dict().fetchError);
        }
    }
}
