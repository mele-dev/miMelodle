import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, computed, input } from "@angular/core";

@Component({
    selector: "app-guess-line-wordle-text",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./guess-line-wordle-text.component.html",
})
export class GuessLineWordleTextComponent implements AfterViewInit {
    show = false;
    text = input.required<string>();
    hintString = input.required<string>();

    isCorrect() {
        return this.text().toLowerCase() === this.hintString().toLowerCase();
    }

    hints = computed(() => {
        return this.hintString()
            .split("")
            .map((char) => {
                return {
                    isCorrect: char !== "~" && char !== "_",
                    isInWrongPlace: char === "~",
                    isWrong: char === "_",
                };
            });
    });

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.show = true;
        }, 16);
    }
}
