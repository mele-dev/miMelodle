import { Component, inject } from "@angular/core";
import { LoginTranslator } from "./login.translations";
import { LanguagePickerComponent } from "../../components/language-picker/language-picker.component";
import { SpotifyRectangleComponent } from "../../icons/spotify-rectangle/spotify-rectangle.component";
import { GoogleRectangleComponent } from "../../icons/google-rectangle/google-rectangle.component";
import { SafeRoutingService } from "../../services/safe-routing.service";
import { RouterModule } from "@angular/router";
import { FormBuilder, ReactiveFormsModule } from "@angular/forms";
import { JsonPipe } from "@angular/common";
import { postAuthLoginBody } from "../../../apiCodegen/backend-zod";
import { postAuthLogin, PostAuthLoginBody } from "../../../apiCodegen/backend";
import { LocalStorageService } from "../../services/local-storage.service";
import { ClientValidationService } from "../../services/client-validation.service";
import { HlmInputModule } from "@spartan-ng/ui-input-helm";
import { toast } from "ngx-sonner";
import axios from "axios";
import { CrFancyButtonStylesDirective } from "../../directives/styling/cr-fancy-button-styles.directive";
import { enviroment } from "../../../enviroments";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [
        LanguagePickerComponent,
        SpotifyRectangleComponent,
        GoogleRectangleComponent,
        RouterModule,
        ReactiveFormsModule,
        JsonPipe,
        HlmInputModule,
        CrFancyButtonStylesDirective,
    ],
    templateUrl: "./login.page.html",
})
export class LoginPage {
    private readonly translator = inject(LoginTranslator);
    private readonly localStorage = inject(LocalStorageService);
    safeRouter = inject(SafeRoutingService);
    private validator = inject(ClientValidationService);
    dict = this.translator.dict;
    front_url = enviroment.front_url
    person = new FormBuilder().nonNullable.group(
        {
            emailOrUsername: "",
            password: "",
        } satisfies { [K in keyof PostAuthLoginBody]: unknown },
        {
            asyncValidators: this.validator.Schema(postAuthLoginBody),
        }
    );

    async onSubmit() {
        try {
            const result = await postAuthLogin(this.person.getRawValue());
            this.localStorage.setItem("userInfo", result);
            this.safeRouter.navigate("/app");
        } catch (e) {
            if (axios.isAxiosError(e) && e.status === 404) {
                toast(this.dict().badLogin);
                return;
            }

            console.error(e);
            toast(this.dict().loginError, {
                action: {
                    label: this.dict().retry,
                    onClick: this.onSubmit,
                },
            });
        }
    }

    readonly splitPopdle = "Popdle"
        .split("")
        .map((value, index) => ({ value, index }));
}
