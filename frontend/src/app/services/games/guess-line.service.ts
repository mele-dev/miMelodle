import { inject, Injectable } from "@angular/core";
import { SelfService } from "../self.service";
import { toast } from "ngx-sonner";
import { postUsersSelfSelfIdGameGuessLine, } from "../../../apiCodegen/backend";
import { SafeRoutingService } from "../safe-routing.service";
import { isAxiosError } from "axios";
import { GuessLineServiceTranslations } from "./guess-line.translations";

@Injectable({
    providedIn: "root",
})
export class GuessLineService {
    private _self = inject(SelfService);
    private _dict = inject(GuessLineServiceTranslations).dict;
    private _router = inject(SafeRoutingService);

    async createGameFromTracks(trackIds: string[]) {
        const user = await this._self.waitForUserInfoSnapshot();

        try {
            toast(this._dict().creatingGame);

            const result = await postUsersSelfSelfIdGameGuessLine(user.id, {
                fromTracks: trackIds,
            });

            toast(this._dict().gameCreated);

            return this._router.navigate("/app/game/guess_line/:gameId", {
                ids: result.data,
            });
        } catch (e) {
            if (isAxiosError(e)) {
                console.log(e.response?.data);
            } else {
                console.log(e);
            }

            toast(this._dict().errorWhileCreatingGame, {
                action: {
                    label: this._dict().retry,
                    onClick: () => this.createGameFromTracks(trackIds),
                },
            });
        }
    }
}
