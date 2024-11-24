import { Component, HostListener, inject } from "@angular/core";
import { HeroPageTranslator } from "./hero.page.translations";
import { SafeRoutingService } from "../../services/safe-routing.service";
import { RouterLink } from "@angular/router";
import { DownArrowComponent } from "../../icons/down-arrow/down-arrow.component";

@Component({
    selector: "app-hero",
    standalone: true,
    imports: [RouterLink, DownArrowComponent],
    templateUrl: "./hero.page.html",
})
export class HeroPage {
    dict = inject(HeroPageTranslator).dict;
    safeRouter = inject(SafeRoutingService);
    private _lastScrollPosition = 0;

    @HostListener("window:scroll", [])
    onScroll(): void {
        const currentScrollPosition = window.pageYOffset;

        if (currentScrollPosition > this._lastScrollPosition) {
            this.scrollToBottom();
        } else {
            this.scrollToTop();
        }

        this._lastScrollPosition = currentScrollPosition;
    }

    private scrollToTop(): void {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    scrollToBottom(): void {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
        });
    }
}
