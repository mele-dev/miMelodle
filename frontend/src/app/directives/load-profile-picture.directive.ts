import {
    Directive,
    effect,
    ElementRef,
    inject,
    input,
    Renderer2,
} from "@angular/core";
import { IconCacheService } from "../services/icon-cache.service";
import { DomSanitizer } from "@angular/platform-browser";

@Directive({
    selector: "[appLoadProfilePicture]",
    standalone: true,
})
export class LoadProfilePictureDirective {
    private _iconCache = inject(IconCacheService);
    bypass = inject(DomSanitizer).bypassSecurityTrustHtml;
    profilePictureFilename = input<string>();
    renderer = inject(Renderer2);
    ref = inject(ElementRef);

    constructor() {
        effect(async () => {
            const filename = this.profilePictureFilename();

            if (!filename) {
                return;
            }

            const svg = await this._iconCache.getProfilePicture(filename);

            this.renderer.setProperty(this.ref.nativeElement, "innerHTML", svg);
        });
    }
}
