import {
    Component,
    computed,
    inject,
    OnInit,
    signal,
    Signal,
} from "@angular/core";
import { registerTranslations } from "./register.translations";
import { JsonPipe } from "@angular/common";
import {
    getPublicIcons,
    getPublicIconsFilename,
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

@Component({
    selector: "app-register-page",
    standalone: true,
    imports: [
        JsonPipe,
        FormsModule,
        RouterModule,
        SpotifyRectangleComponent,
        GoogleRectangleComponent,
        IconPickerComponent,
        TickCircleIconComponent,
    ],
    templateUrl: "./register.page.html",
})
export class RegisterPage implements OnInit {
    private validator = inject(ClientValidationService);
    isFormValid = false;
    dict = registerTranslations.dict;
    allIcons?: BackendIcon[];
    chosenIcon?: BackendIcon;
    sanitizer = inject(DomSanitizer);
    person: PostAuthRegisterBody & { repeatPassword: string } = {
        name: "",
        email: "",
        password: "",
        username: "",
        repeatPassword: "",
        profilePictureId: -1,
    };

    personValidations = {
        name: computed<string | undefined>(() => undefined),
        email: computed<string | undefined>(() => undefined),
        password: computed<string | undefined>(() => undefined),
        repeatPassword: computed<string | undefined>(() => undefined),
        username: computed(() => undefined) as ReturnType<
            typeof this.validator.validateUsername
        >,
    };

    updateLanguage = registerTranslations.updateGlobalLanguage;

    onEmailChange(email: Event) {
        const target = email.target as HTMLInputElement;
        this.personValidations.email = this.validator.validateEmail(
            target.value
        );
        this.person.email = target.value;
    }

    onPasswordChange(password: Event) {
        const target = password.target as HTMLInputElement;
        this.personValidations.password = this.validator.validatePassword(
            target.value
        );
        this.person.password = target.value;
    }

    onRepeatPasswordChange(repeatPassword?: Event) {
        const target = repeatPassword?.target as HTMLInputElement | undefined;

        this.personValidations.repeatPassword =
            this.validator.validateRepeatPassword(
                this.person.password ?? "",
                target?.value ?? this.person.repeatPassword ?? ""
            );

        this.person.repeatPassword = target?.value ?? "";
    }

    onNameChange(name: Event) {
        const target = name.target as HTMLInputElement;
        this.personValidations.name = this.validator.validateName(target.value);
        this.person.name = target.value;
    }

    onUsernameChange(username: Event) {
        const target = username.target as HTMLInputElement;
        this.personValidations.username = this.validator.validateUsername(
            target.value
        );
        console.log(this.personValidations.username());
    }

    onFormChange() {
        const errors = Object.values(this.personValidations);
        const values = Object.values(this.person);

        this.isFormValid =
            (errors.length === 0 || errors.every((v) => v() === undefined)) &&
            values.every((v) => v !== "" && v !== undefined);
    }

    onIconChange(icon: BackendIcon) {
        this.chosenIcon = icon;
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

        this.chosenIcon = this.allIcons.find(
            (v) => v.filename === "default.svg"
        );
    }
}
