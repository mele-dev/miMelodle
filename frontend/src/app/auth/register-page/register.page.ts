import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { CommonModule, JsonPipe } from "@angular/common";
import {
    getPublicIcons,
    getPublicIconsFilename,
    postAuthRegister,
    PostAuthRegisterBody,
} from "../../../apiCodegen/backend";
import { DomSanitizer } from "@angular/platform-browser";
import {
    FormBuilder,
    ReactiveFormsModule,
    ValidationErrors,
} from "@angular/forms";
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
import { SafeRoutingService } from "../../services/safe-routing.service";
import { RegisterTranslator } from "./register.translations";
import { LanguagePickerComponent } from "../../components/language-picker/language-picker.component";
import { AuthLayoutComponent } from "../auth-layout/auth-layout.component";
import { LocalStorageService } from "../../services/local-storage.service";
import { MinusCircleIconComponent } from "../../icons/minus-circle-icon/minus-circle-icon.component";

type RegisterFormFields = PostAuthRegisterBody & { repeatPassword: string };

@Component({
    selector: "app-register-page",
    standalone: true,
    imports: [
        JsonPipe,
        ReactiveFormsModule,
        AuthLayoutComponent,
        RouterModule,
        SpotifyRectangleComponent,
        GoogleRectangleComponent,
        IconPickerComponent,
        TickCircleIconComponent,
        InfoCircleComponent,
        CommonModule,
        LanguagePickerComponent,
    MinusCircleIconComponent
    ],
    templateUrl: "./register.page.html",
})
export class RegisterPage implements OnInit {
    private validator = inject(ClientValidationService);
    private translator = inject(RegisterTranslator);
    private localStorage = inject(LocalStorageService);
    safeRouter = inject(SafeRoutingService);
    dict = this.translator.dict;
    allIcons?: BackendIcon[];
    chosenIcon = signal<BackendIcon | undefined>(undefined);
    sanitizer = inject(DomSanitizer);

    private schema = postAuthRegisterBody;

    private builder = new FormBuilder().nonNullable;

    person = this.builder.group(
        {
            profilePictureId: this.builder.control(
                this.chosenIcon()?.id ?? -1,
                [],
                this.validator.Schema(this.schema.shape.profilePictureId)
            ),
            name: this.builder.control(
                "",
                [],
                this.validator.Schema(this.schema.shape.name)
            ),
            username: this.builder.control("", [], this.validateUsername()),
            email: this.builder.control("", [], [this.validateEmail()]),
            password: this.builder.control(
                "",
                [],
                this.validator.Schema(this.schema.shape.password)
            ),
            repeatPassword: "",
        } satisfies { [K in keyof RegisterFormFields]: unknown },
        {
            validators: this.validator.validateRepeatPassword,
            asyncValidators: this.validator.Schema(this.schema),
        }
    );

    private validateEmail() {
        const thisBinding = this;
        return async function (control: { value: string }) {
            return (
                (await thisBinding.validator.Schema(
                    thisBinding.schema.shape.email
                )(control)) ??
                (await thisBinding.validator.validateUniqueEmail(control))
            );
        };
    }

    private validateUsername() {
        const thisBinding = this;
        return async function (control: { value: string }) {
            const output =
                (await thisBinding.validator.Schema(
                    thisBinding.schema.shape.username
                )(control)) ??
                (await thisBinding.validator.validateUniqueUsername(control));
            return output;
        };
    }

    constructor() {
        // Effects must go on constructors for some reason. This would fail on
        // ngOnInit.
        effect(() =>
            this.person.patchValue({
                profilePictureId: this.chosenIcon()?.id ?? -1,
            })
        );
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

    ifFilled<T>(input: unknown, message: T) {
        return !input ? undefined : message;
    }

    async onSubmit() {
        try {
            const result = await postAuthRegister(this.person.getRawValue());
            this.localStorage.setItem("userInfo", result.data);
            this.safeRouter.navigate(["/app"]);
        } catch (e) {
            if (e instanceof axios.AxiosError) {
            }
            console.error(e);
            alert("Error al crear cuenta.");
        }
    }
}
