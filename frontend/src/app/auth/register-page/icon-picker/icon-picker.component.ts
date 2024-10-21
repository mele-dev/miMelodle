import { Component, inject, input, OnInit, output } from "@angular/core";
import { BackendIcon } from "../../../types/backend-icon";
import { JsonPipe } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";

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
    imports: [JsonPipe],
    templateUrl: "./icon-picker.component.html",
})
export class IconPickerComponent implements OnInit {
    sanitizer = inject(DomSanitizer);
    icons = input.required<BackendIcon[]>();
    columns = input.required<IntRange<1, 13>>();
    OnIconChange = output<BackendIcon>();
    selectedIcon: BackendIcon | undefined = undefined;

    ngOnInit(): void {
        // TODO: Make two way binding work.
        this.OnIconChange.subscribe((icon) => {
            this.selectedIcon = icon;
        });
    }
}
