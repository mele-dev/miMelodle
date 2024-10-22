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
            username: this.builder.control(
                "",
                [],
                this.validator.Schema(this.schema.shape.username)
            ),
            email: this.builder.control(
                "",
                [],
                this.validator.Schema(this.schema.shape.email)
            ),
            password: this.builder.control(
                "",
                [],
                this.validator.Schema(this.schema.shape.password)
            ),
            repeatPassword: this.builder.control(
                "",
                this.validateRepeatPassword()
            ),
        } satisfies { [K in keyof RegisterFormFields]: unknown },
        {
            validators: this.validateRepeatPassword(),
            asyncValidators: this.validator.Schema(this.schema),
        }
    );

    private validateRepeatPassword() {
        const thisBinding = this;
        return function (): ValidationErrors | null {
            if (!thisBinding.person) {
                return null;
            }
            return thisBinding.validator.validateRepeatPassword(
                thisBinding.person.controls.password.value,
                thisBinding.person.controls.repeatPassword.value
            );
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
            this.safeRouter.navigate(["/"]);
        } catch (e) {
            if (e instanceof axios.AxiosError) {
            }
            console.error(e);
            alert("Error al crear cuenta.");
        }
    }
}
