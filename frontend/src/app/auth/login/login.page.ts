import { Component, inject } from "@angular/core";
import { LoginTranslator } from "./login.translations";
import { LanguagePickerComponent } from "../../components/language-picker/language-picker.component";
import { SpotifyRectangleComponent } from "../../icons/spotify-rectangle/spotify-rectangle.component";
import { GoogleRectangleComponent } from "../../icons/google-rectangle/google-rectangle.component";
import { InnerRoutingService } from "../../services/inner-routing.service";
import { RouterModule } from "@angular/router";
import {
    FormBuilder,
    ReactiveFormsModule,
} from "@angular/forms";
import { JsonPipe } from "@angular/common";
import {
    postAuthLoginBody,
} from "../../../apiCodegen/backend-zod";
import { postAuthLogin, PostAuthLoginBody } from "../../../apiCodegen/backend";
import { LocalStorageService } from "../../services/local-storage.service";

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
    ],
    templateUrl: "./login.page.html",
})
export class LoginPage {
    private readonly translator = inject(LoginTranslator);
    private readonly localStorage = inject(LocalStorageService);
    innerRouter = inject(InnerRoutingService);
    dict = this.translator.dict;

    person = new FormBuilder().nonNullable.group(
        {
            email: "",
            password: "",
        } satisfies { [K in keyof PostAuthLoginBody]: unknown },
        {
            validators: (c) => postAuthLoginBody.safeParse(c.value).error ?? {},
        }
    );

    async onSubmit() {
        try {
            const result = await postAuthLogin(this.person.getRawValue());
            this.localStorage.setItem("userInfo", result.data);
            this.innerRouter.navigate(["/"]);
        } catch (e) {
            alert("Error al iniciar sesión.");
        }
    }

    readonly splitMelodle = "Melodle"
        .split("")
        .map((value, index) => ({ value, index }));
}
