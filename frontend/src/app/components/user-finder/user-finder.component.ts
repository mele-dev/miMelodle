import { Component, effect, inject, signal } from "@angular/core";
import { getUsersSearch, GetUsersSearch200 } from "../../../apiCodegen/backend";
import {
    getUsersSearchQueryPageSizeMax,
    getUsersSearchQueryQueryMin,
} from "../../../apiCodegen/backend-zod";
import { toast } from "ngx-sonner";
import { UserFinderTranslator } from "./user-finder.translations";
import { FormsModule } from "@angular/forms";
import { HlmInputDirective } from "@spartan-ng/ui-input-helm";
import { JsonPipe } from "@angular/common";
import { BrnTableModule } from "@spartan-ng/ui-table-brain";
import { HlmTableModule } from "@spartan-ng/ui-table-helm";
import { IconCacheService } from "../../services/icon-cache.service";
import { DomSanitizer } from "@angular/platform-browser";
import { HlmButtonDirective } from "@spartan-ng/ui-button-helm";
import {
    HlmMenuComponent,
    HlmMenuGroupComponent,
    HlmMenuItemDirective,
    HlmMenuItemIconDirective,
    HlmMenuItemSubIndicatorComponent,
    HlmMenuLabelComponent,
    HlmMenuSeparatorComponent,
    HlmMenuShortcutComponent,
    HlmSubMenuComponent,
} from "@spartan-ng/ui-menu-helm";
import { BrnMenuTriggerDirective } from "@spartan-ng/ui-menu-brain";

type SearchedUser = GetUsersSearch200["matches"][number];

@Component({
    selector: "app-user-finder",
    standalone: true,
    imports: [
        FormsModule,
        HlmInputDirective,
        JsonPipe,
        BrnTableModule,
        HlmTableModule,
        HlmButtonDirective,

        HlmMenuComponent,
        HlmMenuGroupComponent,
        HlmMenuItemDirective,
        HlmMenuItemIconDirective,
        HlmMenuItemSubIndicatorComponent,
        HlmMenuLabelComponent,
        HlmMenuSeparatorComponent,
        HlmMenuShortcutComponent,
        HlmSubMenuComponent,
        BrnMenuTriggerDirective,
    ],
    templateUrl: "./user-finder.component.html",
})
export class UserFinderComponent {
    dict = inject(UserFinderTranslator).dict;
    userFilter = signal<string>("");
    matchedUsers = signal<SearchedUser[] & { svg: string }[]>([]);
    private _icons = inject(IconCacheService);
    sanitizer = inject(DomSanitizer);

    constructor() {
        effect(
            async () => {
                const filter = this.userFilter();

                if (filter.length < getUsersSearchQueryQueryMin) {
                    this.matchedUsers.set([]);
                    return;
                }

                try {
                    const result = await getUsersSearch({
                        query: filter,
                        page: 0,
                        pageSize: getUsersSearchQueryPageSizeMax,
                    });

                    const resultWithIcons = await Promise.all(
                        result.data.matches.map(async (match) => ({
                            ...match,
                            svg:
                                (await this._icons.getProfilePicture(
                                    match.profilePictureFilename
                                )) ?? "",
                        }))
                    );

                    this.matchedUsers.set(resultWithIcons);
                } catch (e) {
                    console.error("Error while searching users:", e);
                    toast(this.dict().searchUsersError);
                    return;
                }
            },
            { allowSignalWrites: true }
        );
    }

    addFriend(user: SearchedUser) {
        toast(`${user.name} has been sent a friend request.`);
    }
}
