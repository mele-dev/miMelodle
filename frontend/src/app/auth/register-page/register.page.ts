import { Component, effect, inject, OnInit, signal } from "@angular/core";
import { CommonModule, JsonPipe } from "@angular/common";
import {
    getPublicIcons,
    getPublicIconsFilename,
    PostAuthLogin404,
    postAuthRegister,
    PostAuthRegisterBody,
} from "../../../apiCodegen/backend";
import { DomSanitizer } from "@angular/platform-browser";
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
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
import { HlmInputDirective } from "@spartan-ng/ui-input-helm";
import { HlmLabelDirective } from "@spartan-ng/ui-label-helm";
import { MinusCircleIconComponent } from "../../icons/minus-circle-icon/minus-circle-icon.component";
import { HlmIconComponent } from "@spartan-ng/ui-icon-helm";
import { provideIcons } from "@ng-icons/core";
import { lucideAlertCircle } from "@ng-icons/lucide";
import { toast } from "ngx-sonner";
import { CrFancyButtonStylesDirective } from "../../directives/styling/cr-fancy-button-styles.directive";

type RegisterFormFields = PostAuthRegisterBody & { repeatPassword: string };

@Component({
    selector: "app-register-page",
    standalone: true,
    imports: [
        JsonPipe,
        ReactiveFormsModule,
        HlmLabelDirective,
        AuthLayoutComponent,
        RouterModule,
        SpotifyRectangleComponent,
        GoogleRectangleComponent,
        IconPickerComponent,
        TickCircleIconComponent,
        InfoCircleComponent,
        CommonModule,
        LanguagePickerComponent,
        HlmInputDirective,
        MinusCircleIconComponent,
        HlmIconComponent,
        CrFancyButtonStylesDirective,
    ],
    providers: [provideIcons({ lucideAlertCircle })],
    templateUrl: "./register.page.html",
})
export class RegisterPage implements OnInit {
    private _validator = inject(ClientValidationService);
    private _translator = inject(RegisterTranslator);
    private _localStorage = inject(LocalStorageService);
    safeRouter = inject(SafeRoutingService);
    dict = this._translator.dict;
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
                this._validator.Schema(this.schema.shape.profilePictureId)
            ),
            name: this.builder.control(
                "",
                [],
                this._validator.Schema(this.schema.shape.name)
            ),
            username: this.builder.control("", [], this.validateUsername()),
            email: this.builder.control("", [], [this.validateEmail()]),
            password: this.builder.control(
                "",
                [],
                this._validator.Schema(this.schema.shape.password)
            ),
            repeatPassword: "",
        } satisfies { [K in keyof RegisterFormFields]: unknown },
        {
            validators: this._validator.mustMatch("nonRepeatedPassword", [
                "repeatPassword",
                "password",
            ] satisfies (keyof RegisterFormFields)[]),
            asyncValidators: this._validator.Schema(this.schema),
        }
    );

    private validateEmail() {
        const thisBinding = this;
        return async function (control: { value: string }) {
            return (
                (await thisBinding._validator.Schema(
                    thisBinding.schema.shape.email
                )(control)) ??
                (await thisBinding._validator.validateUniqueEmail(control))
            );
        };
    }

    private validateUsername() {
        const thisBinding = this;
        return async function (control: AbstractControl) {
            const output =
                (await thisBinding._validator.Schema(
                    thisBinding.schema.shape.username
                )(control)) ??
                (await thisBinding._validator.validateUniqueUsername(control));
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

    async onSubmit() {
        try {
            const result = await postAuthRegister(this.person.getRawValue());
            this._localStorage.setItem("userInfo", result.data);
            this.safeRouter.navigate("/app");
        } catch (e) {
            console.error(e);
            toast(this.dict().createAccountFail);
        }
    }
}
