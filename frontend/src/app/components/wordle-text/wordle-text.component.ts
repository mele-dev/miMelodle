import { CommonModule } from "@angular/common";
import { Component, input } from "@angular/core";

export type WordleTextModifiers = {
    hint: "Correct" | "Wrong spot" | "Wrong";
    char: string;
};

export type WordleTextInputSelection = { start: number; end: number };

@Component({
    selector: "app-wordle-text",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./wordle-text.component.html",
})
export class WordleTextComponent {
    text = input.required<WordleTextModifiers[]>();
    selection = input<WordleTextInputSelection>();
    isPending = input.required<boolean>();

    isSelected(index: number) {
        return (
            !!this.selection() &&
            this.selection()!.start <= index &&
            this.selection()!.end > index
        );
    }
}
