import { JsonPipe } from "@angular/common";
import {
    Component,
    computed,
    inject,
    input,
    OnInit,
    signal,
} from "@angular/core";
import { z } from "zod";
import {
    getUsersSelfSelfIdGameGuessSongGameId,
    GetUsersSelfSelfIdGameGuessSongGameIdResult,
} from "../../../../apiCodegen/backend";
import { SelfService } from "../../../services/self.service";

@Component({
    selector: "app-guess-song",
    standalone: true,
    imports: [JsonPipe],
    templateUrl: "./guess-song.page.html",
})
export class GuessSongPage implements OnInit {
    readonly gameId = input.required<string>();
    private _self = inject(SelfService);
    ids = computed(() => {
        const schema = z.object({ gameId: z.coerce.number().positive() });
        const parsed = schema.safeParse({
            gameId: this.gameId(),
        });

        if (!parsed.success) {
            return { gameId: -Infinity };
        }

        return parsed.data;
    });

    gameInfo = signal<
        GetUsersSelfSelfIdGameGuessSongGameIdResult["data"] | undefined
    >(undefined);

    async ngOnInit() {
        const self = await this._self.waitForUserInfoSnapshot();
        try {
            const result = await getUsersSelfSelfIdGameGuessSongGameId(
                self.id,
                this.ids().gameId
            );

            this.gameInfo.set(result.data);
        } catch (e) {
            console.error(e);
        }
    }
}
