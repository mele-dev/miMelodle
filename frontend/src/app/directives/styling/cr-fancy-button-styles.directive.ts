import {
    AfterViewInit,
    Directive,
    ElementRef,
    inject,
    Renderer2,
} from "@angular/core";

@Directive({
    selector: "[appCrFancyButtonStyles]",
    standalone: true,
})
export class CrFancyButtonStylesDirective {
    constructor(private element: ElementRef<HTMLButtonElement>) {
        this.element.nativeElement.classList.add(
            ...`w-full shadow-xl shadow-fuchsia-500/50 disabled:shadow-none scale-105 rounded-lg bg-fuchsia-500 p-2 px-4 text-lg font-extrabold text-neutral-800 transition-all disabled:scale-100 disabled:cursor-not-allowed disabled:hover:bg-neutral-800 disabled:hover:text-neutral-200`.split(' ')
        );
    }
}
