import { Component, OnInit } from "@angular/core";
import { registerTranslations } from "./register-page.translations";
import { JsonPipe } from "@angular/common";
import {
    getPublicIcons,
    GetPublicIcons200Item,
    getPublicIconsFilename,
} from "../../apiCodegen/backend";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    selector: "app-register-page",
    standalone: true,
    imports: [JsonPipe],
    templateUrl: "./register-page.component.html",
})
export class RegisterPageComponent implements OnInit {
    dict = registerTranslations.getDict();
    allIcons?: {
        svg: string;
        iconInfo: GetPublicIcons200Item;
    }[];

    defaultIcon?: {
        svg: string;
        iconInfo: GetPublicIcons200Item;
    };

    constructor(public sanitizer: DomSanitizer) {}

    async ngOnInit(): Promise<void> {
        const iconsInfo = (await getPublicIcons()).data;

        this.allIcons = await Promise.all(
            iconsInfo.map(async (icon) => ({
                svg: await (
                    await getPublicIconsFilename(icon.filename)
                ).data.text(),
                iconInfo: icon,
            }))
        );

        this.defaultIcon = this.allIcons.find(
            (v) => v.iconInfo.filename === "default.svg"
        );

        console.log(this.allIcons);
    }
}
