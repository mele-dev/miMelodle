import { CommonModule, JsonPipe } from "@angular/common";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { provideIcons } from "@ng-icons/core";
import { lucideArrowUpDown, lucideChevronRight } from "@ng-icons/lucide";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { HlmCarouselComponent } from "@spartan-ng/ui-carousel-helm";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { HlmScrollAreaModule } from "@spartan-ng/ui-scrollarea-helm";
import { HlmSeparatorModule } from "@spartan-ng/ui-separator-helm";

@Component({
    selector: "app-create-game",
    standalone: true,
    imports: [HlmSeparatorModule, CommonModule, HlmButtonModule, HlmIconModule, HlmScrollAreaModule],
    providers: [provideIcons({ lucideArrowUpDown })],
    templateUrl: "./create-game.page.html",
})
export class CreateGamePage {
    readonly titles = ["line!", "song!"] as const;
    private selectedIndex = 0;
    selected: (typeof this.titles)[number] = "line!";

    @ViewChild("mycarousel") carousel!: ElementRef<HlmCarouselComponent>;
    debug = "default" as any;

    next() {
        this.selectedIndex++;
        this.selectedIndex %= this.titles.length;
        this.selected = this.titles[this.selectedIndex];
    }
}
