import { Component, inject, input, model } from "@angular/core";
import { BackendIcon } from "../../../types/backend-icon";
import { JsonPipe } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";

type Enumerate<
    N extends number,
    Acc extends number[] = [],
> = Acc["length"] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc["length"]]>;

type IntRange<F extends number, T extends number> = Exclude<
    Enumerate<T>,
    Enumerate<F>
>;

@Component({
    selector: "app-icon-picker",
    standalone: true,
    imports: [JsonPipe, FormsModule],
    templateUrl: "./icon-picker.component.html",
})
export class IconPickerComponent {
    sanitizer = inject(DomSanitizer);
    icons = input.required<BackendIcon[]>();
    columns = input.required<IntRange<1, 13>>();
    selectedIcon = model<BackendIcon>();
}
