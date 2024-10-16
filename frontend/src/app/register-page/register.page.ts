import { Component, inject, input, OnInit, output } from "@angular/core";
import { registerTranslations } from "./register.translations";
import { JsonPipe } from "@angular/common";
import {
    getPublicIcons,
    GetPublicIcons200Item,
    getPublicIconsFilename,
    PostAuthRegisterBody,
} from "../../apiCodegen/backend";
import { DomSanitizer } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ClientValidationService } from "../services/client-validation.service";

@Component({
    selector: "app-register-page",
    standalone: true,
    imports: [JsonPipe, FormsModule, RouterModule],
    templateUrl: "./register.page.html",
})
export class RegisterPage implements OnInit {
    isFormValid = false;
    dict = registerTranslations.getDict();
    allIcons?: {
        svg: string;
        iconInfo: GetPublicIcons200Item;
    }[];
    chosenIcon?: {
        svg: string;
        iconInfo: GetPublicIcons200Item;
    };
    sanitizer = inject(DomSanitizer);
    private validator = inject(ClientValidationService);
    person: Partial<PostAuthRegisterBody & { repeatPassword: string }> = {
        name: "asda",
        email: "",
        password: "",
        username: "asdad",
        profilePictureId: -1,
    };

    personValidations: {
        [K in keyof PostAuthRegisterBody | "repeatPassword"]?:
            | string
            | undefined;
    } = {};

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

        this.person.repeatPassword = target?.value;
    }

    onNameChange(name: Event) {
        const target = name.target as HTMLInputElement;
        this.personValidations.name = this.validator.validateName(target.value);
        this.person.name = target.value;
    }

    onFormChange() {
        const errors = Object.values(this.personValidations);
        const values = Object.values(this.person);

        this.isFormValid =
            (errors.length === 0 || errors.every((v) => v === undefined)) &&
            values.every((v) => v !== "" && v !== undefined);

        console.log(this.person);
        console.log(this.personValidations);
    }

    async ngOnInit(): Promise<void> {
        const iconsInfo = (await getPublicIcons()).data;

        this.allIcons = await Promise.all(
            iconsInfo.map(async (icon) => ({
                svg: await (
                    await getPublicIconsFilename(icon.filename)
                ).data.text(),
                iconInfo: icon,
            }))
        );

        this.chosenIcon = this.allIcons.find(
            (v) => v.iconInfo.filename === "default.svg"
        );
    }
}
