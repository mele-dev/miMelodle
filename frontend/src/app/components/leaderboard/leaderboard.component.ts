import {
    Component,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
    ViewChildren,
} from "@angular/core";
import { HlmTableComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-table.component";
import { LeaderboardsService } from "../../services/leaderboards.service";
import { HlmTrowComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-trow.component";
import { HlmTdComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-td.component";
import { SelfService } from "../../services/self.service";
import { DomSanitizer } from "@angular/platform-browser";
import { IconCacheService } from "../../services/icon-cache.service";
import { TrophyComponent } from "../../icons/trophy/trophy.component";
import { HlmThComponent } from "../../../../libs/ui/ui-table-helm/src/lib/hlm-th.component";
import { CommonModule } from "@angular/common";
import { HlmIconComponent } from "../../../../libs/ui/ui-icon-helm/src/lib/hlm-icon.component";
import { TranslatorService } from "../../services/translator.service";
import { LeaderboardTranslator } from "./leaderboard.translations";
import { XComponent } from "../../icons/x/x.component";
import { SafeRoutingService } from "../../services/safe-routing.service";
import { provideIcons } from "@ng-icons/core";
import { lucideChevronLeft, lucideChevronRight } from "@ng-icons/lucide";
import { LocalStorageService } from "../../services/local-storage.service";

@Component({
    selector: "app-leaderboard",
    standalone: true,
    imports: [
        HlmTableComponent,
        HlmTrowComponent,
        HlmTdComponent,
        TrophyComponent,
        HlmThComponent,
        CommonModule,
        HlmIconComponent,
        XComponent,
    ],
    providers: [provideIcons({ lucideChevronRight, lucideChevronLeft })],

    templateUrl: "./leaderboard.component.html",
})
export class LeaderboardComponent implements OnInit {
    dict = inject(LeaderboardTranslator).dict;
    @ViewChild("dialog") dialog!: ElementRef<HTMLDialogElement>;
    router = inject(SafeRoutingService);
    public localService = inject(LocalStorageService)

    readonly titles = ["line", "song"] as const;
    selected: (typeof this.titles)[number] = "line";
    private selectedIndex = 0;

    next() {
        this.selectedIndex++;
        this.selectedIndex %= this.titles.length;
        this.selected = this.titles[this.selectedIndex];
    }
    public leaderboardService = inject(LeaderboardsService);
    sanitizer = inject(DomSanitizer);
    public iconsService = inject(IconCacheService);

    ngOnInit() {
        this.leaderboardService.reloadGlobals();
    }

    public deleteAllData(gameMode: string) {
        this.leaderboardService.deleteData(gameMode);
        this.closeDialog();
    }

    public openDialog() {
        this.dialog.nativeElement.showModal();
    }

    public closeDialog() {
        this.dialog.nativeElement.close();
    }

    public toogleRoutes(goTo: string) {
        if (goTo === "friends") {
            this.router.navigate("/app/leaderboards/friends");
            return;
        }
        this.router.navigate("/app/leaderboards");
        return;
    }
}
