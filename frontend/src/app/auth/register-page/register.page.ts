import {
    Component,
    computed,
    inject,
    OnInit,
    Signal,
    signal,
} from "@angular/core";
import { CommonModule, JsonPipe } from "@angular/common";
import {
    getPublicIcons,
    getPublicIconsFilename,
    postAuthRegister,
    PostAuthRegisterBody,
} from "../../../apiCodegen/backend";
import { DomSanitizer } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ClientValidationService } from "../../services/client-validation.service";
import { SpotifyRectangleComponent } from "../../icons/spotify-rectangle/spotify-rectangle.component";
import { GoogleRectangleComponent } from "../../icons/google-rectangle/google-rectangle.component";
import { BackendIcon } from "../../types/backend-icon";
import { IconPickerComponent } from "./icon-picker/icon-picker.component";
import { TickCircleIconComponent } from "../../icons/tick-circle-icon/tick-circle-icon.component";
import { InfoCircleComponent } from "../../icons/info-circle/info-circle.component";
import { postAuthRegisterBody } from "../../../apiCodegen/backend-zod";
import axios from "axios";
import { InnerRoutingService } from "../../services/inner-routing.service";
import { RegisterTranslator } from "./register.translations";
import { LanguagePickerComponent } from "../../components/language-picker/language-picker.component";
import { AuthLayoutComponent } from "../auth-layout/auth-layout.component";
import { LocalStorageService } from "../../services/local-storage.service";

type RegisterFormFields = PostAuthRegisterBody & { repeatPassword: string };

@Component({
    selector: "app-register-page",
    standalone: true,
    imports: [
        JsonPipe,
        FormsModule,
        AuthLayoutComponent,
        RouterModule,
        SpotifyRectangleComponent,
        GoogleRectangleComponent,
        IconPickerComponent,
        TickCircleIconComponent,
        InfoCircleComponent,
        CommonModule,
        LanguagePickerComponent,
    ],
    templateUrl: "./register.page.html",
})
export class RegisterPage implements OnInit {
    private validator = inject(ClientValidationService);
    private translator = inject(RegisterTranslator);
    private localStorage = inject(LocalStorageService);
    innerRouter = inject(InnerRoutingService);
    isFormValid = false;
    dict = this.translator.dict;
    allIcons?: BackendIcon[];
    chosenIcon = signal<BackendIcon | undefined>(undefined);
    sanitizer = inject(DomSanitizer);
    // TODO: Change this to use reactive forms.
    person = {
        name: signal(""),
        email: signal(""),
        password: signal(""),
        username: signal(""),
        repeatPassword: signal(""),
        // Set -1 by default since all backend ids are positive.
        profilePictureId: computed(() => this.chosenIcon()?.id ?? -1),
    } satisfies {
        [K in keyof RegisterFormFields]: Signal<RegisterFormFields[K]>;
    };

    personValidations = {
        name: computed(() => this.validator.validateName(this.person.name())()),
        email: computed(() =>
            this.validator.validateEmail(this.person.email())()
        ),
        password: computed(() =>
            this.validator.validatePassword(this.person.password())()
        ),
        repeatPassword: computed(() =>
            this.validator.validateRepeatPassword(
                this.person.password(),
                this.person.repeatPassword()
            )()
        ),
        username: computed(() =>
            this.validator.validateUsername(this.person.username())()
        ),
    };

    updateLanguage = this.translator.updateGlobalLanguage;

    ifFilled<T>(input: unknown, message: T) {
        return !input ? undefined : message;
    }

    onFormChange() {
        const errors = Object.values(this.personValidations);
        const values = Object.values(this.person);

        this.isFormValid =
            (errors.length === 0 || errors.every((v) => v() === undefined)) &&
            values.every((v) => v() !== "" && v() !== undefined);
    }

    async onSubmit() {
        const person = {
            password: this.person.password(),
            email: this.person.email(),
            profilePictureId: this.person.profilePictureId(),
            name: this.person.name(),
            username: this.person.username(),
        } satisfies PostAuthRegisterBody;
        const check = postAuthRegisterBody.safeParse(person);

        if (!check.success) {
            alert("Datos incorrectos.");
            return;
        }

        try {
            const result = await postAuthRegister(person);
            this.localStorage.setItem("userInfo", result.data);
            this.innerRouter.navigate(["/"]);
        } catch (e) {
            if (e instanceof axios.AxiosError) {
            }
            console.error(e);
            alert("Error al crear cuenta.");
        }
    }

    async ngOnInit(): Promise<void> {
        const iconsInfo = (await getPublicIcons()).data;

        this.allIcons = await Promise.all(
            iconsInfo.map(async (icon) => ({
                svg: await (
                    await getPublicIconsFilename(icon.filename)
                ).data.text(),
                ...icon,
            }))
        );

        this.chosenIcon.set(
            this.allIcons.find((v) => v.filename === "default.svg")
        );
    }
}
