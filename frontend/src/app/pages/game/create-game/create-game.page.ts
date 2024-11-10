import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { provideIcons } from "@ng-icons/core";
import { lucideArrowUpDown, lucidePlus } from "@ng-icons/lucide";
import { HlmButtonModule } from "@spartan-ng/ui-button-helm";
import { HlmIconModule } from "@spartan-ng/ui-icon-helm";
import { HlmScrollAreaModule } from "@spartan-ng/ui-scrollarea-helm";
import { HlmSeparatorModule } from "@spartan-ng/ui-separator-helm";
import {
    ArtistListItem,
    ArtistListItemComponent,
} from "../../../components/artist-list-item/artist-list-item.component";
import { CrFancyButtonStylesDirective } from "../../../directives/styling/cr-fancy-button-styles.directive";
import { postUsersSelfSelfIdGameGuessSong } from "../../../../apiCodegen/backend";
import { SelfService } from "../../../services/self.service";
import { SafeRoutingService } from "../../../services/safe-routing.service";
import { isAxiosError } from "axios";
import { toast } from "ngx-sonner";

@Component({
    selector: "app-create-game",
    standalone: true,
    imports: [
        HlmSeparatorModule,
        CommonModule,
        HlmButtonModule,
        HlmIconModule,
        HlmScrollAreaModule,
        ArtistListItemComponent,
        CrFancyButtonStylesDirective,
    ],
    providers: [provideIcons({ lucideArrowUpDown, lucidePlus })],
    templateUrl: "./create-game.page.html",
})
export class CreateGamePage {
    readonly titles = ["line!", "song!"] as const;
    private readonly _self = inject(SelfService);
    private readonly _router = inject(SafeRoutingService);
    private selectedIndex = 0;

    selected: (typeof this.titles)[number] = "line!";

    artists = signal([
        {
            name: "El Cuarteto De Nos",
            id: "13JJKrUewC1CJYmIDXQNoH",
            genres: ["rock uruguayo"],
            followers: {
                href: null,
                total: 2377072,
            },
            popularity: 71,
            images: [
                {
                    url: "https://i.scdn.co/image/ab6761610000e5eb4e75c94ad7365dfcdb3201bf",
                    width: 640,
                    height: 640,
                },
                {
                    url: "https://i.scdn.co/image/ab676161000051744e75c94ad7365dfcdb3201bf",
                    width: 320,
                    height: 320,
                },
                {
                    url: "https://i.scdn.co/image/ab6761610000f1784e75c94ad7365dfcdb3201bf",
                    width: 160,
                    height: 160,
                },
            ],
            external_urls: {
                spotify:
                    "https://open.spotify.com/artist/13JJKrUewC1CJYmIDXQNoH",
            },
        },
        {
            name: "Cuco",
            id: "2Tglaf8nvDzwSQnpSrjLHP",
            genres: ["bedroom pop", "dream pop"],
            followers: {
                href: null,
                total: 3022285,
            },
            popularity: 70,
            images: [
                {
                    url: "https://i.scdn.co/image/ab6761610000e5eb23b561fde78304112ee9f847",
                    width: 640,
                    height: 640,
                },
                {
                    url: "https://i.scdn.co/image/ab6761610000517423b561fde78304112ee9f847",
                    width: 320,
                    height: 320,
                },
                {
                    url: "https://i.scdn.co/image/ab6761610000f17823b561fde78304112ee9f847",
                    width: 160,
                    height: 160,
                },
            ],
            external_urls: {
                spotify:
                    "https://open.spotify.com/artist/2Tglaf8nvDzwSQnpSrjLHP",
            },
        },
        {
            name: "King Crimson",
            id: "7M1FPw29m5FbicYzS2xdpi",
            genres: [
                "art rock",
                "instrumental rock",
                "jazz rock",
                "progressive rock",
                "psychedelic rock",
                "symphonic rock",
                "zolo",
            ],
            followers: {
                href: null,
                total: 1200510,
            },
            popularity: 57,
            images: [
                {
                    url: "https://i.scdn.co/image/ab6761610000e5eb7c1c2fcf5a73dbfa60a40a18",
                    width: 640,
                    height: 640,
                },
                {
                    url: "https://i.scdn.co/image/ab676161000051747c1c2fcf5a73dbfa60a40a18",
                    width: 320,
                    height: 320,
                },
                {
                    url: "https://i.scdn.co/image/ab6761610000f1787c1c2fcf5a73dbfa60a40a18",
                    width: 160,
                    height: 160,
                },
            ],
            external_urls: {
                spotify:
                    "https://open.spotify.com/artist/7M1FPw29m5FbicYzS2xdpi",
            },
        },
        {
            name: "Shakira",
            id: "0EmeFodog0BfCgMzAIvKQp",
            genres: ["colombian pop", "dance pop", "latin pop", "pop"],
            followers: {
                href: null,
                total: 35212904,
            },
            popularity: 88,
            images: [
                {
                    url: "https://i.scdn.co/image/ab6761610000e5eb2528c726e5ddb90a7197e527",
                    width: 640,
                    height: 640,
                },
                {
                    url: "https://i.scdn.co/image/ab676161000051742528c726e5ddb90a7197e527",
                    width: 320,
                    height: 320,
                },
                {
                    url: "https://i.scdn.co/image/ab6761610000f1782528c726e5ddb90a7197e527",
                    width: 160,
                    height: 160,
                },
            ],
            external_urls: {
                spotify:
                    "https://open.spotify.com/artist/0EmeFodog0BfCgMzAIvKQp",
            },
        },
        {
            name: "KAROL G",
            id: "790FomKkXshlbRYZFtlgla",
            genres: ["reggaeton", "reggaeton colombiano", "urbano latino"],
            followers: {
                href: null,
                total: 51695843,
            },
            popularity: 91,
            images: [
                {
                    url: "https://i.scdn.co/image/ab6761610000e5eb4b0754aefc9db490e02205ec",
                    width: 640,
                    height: 640,
                },
                {
                    url: "https://i.scdn.co/image/ab676161000051744b0754aefc9db490e02205ec",
                    width: 320,
                    height: 320,
                },
                {
                    url: "https://i.scdn.co/image/ab6761610000f1784b0754aefc9db490e02205ec",
                    width: 160,
                    height: 160,
                },
            ],
            external_urls: {
                spotify:
                    "https://open.spotify.com/artist/790FomKkXshlbRYZFtlgla",
            },
        },
    ] as any as ArtistListItem[]);

    next() {
        this.selectedIndex++;
        this.selectedIndex %= this.titles.length;
        this.selected = this.titles[this.selectedIndex];
    }

    remove(artist: ArtistListItem) {
        this.artists.set(
            this.artists().filter(
                (a) => a.id !== artist.id
            )
        );
    }

    async submit() {
        if (this.selected === "line!") {
            toast("TODO! Try a different game mode.");
            return;
        }

        const user = await this._self.waitForUserInfoSnapshot();

        try {
            toast("Creating game, hold on tight!");
            const result = await postUsersSelfSelfIdGameGuessSong(user.id, {
                fromArtists: this.artists().map(
                    (artist) => artist.id
                ),
            });
            toast("Game created!");
            this._router.navigate("/app/game/guess_song/:gameId", {
                ids: { gameId: result.data.gameId },
            });
        } catch (e) {
            if (isAxiosError(e)) {
                toast("Error while submitting attempt");
                console.log(e);
                console.log(e.response?.data);
            }
        }
    }
}
