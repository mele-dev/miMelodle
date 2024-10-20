import { computed, inject, Injectable } from "@angular/core";
import {
    postAuthLoginBody,
    postAuthLoginBodyEmailMax,
    postAuthLoginBodyEmailRegExp,
    postAuthRegisterBody,
} from "../../apiCodegen/backend-zod";
import { ValidationTranslator } from "./client-validation.translation";

@Injectable({
  providedIn: "any"
})
export class ClientValidationService {
    private translator = inject(ValidationTranslator);
    dict = this.translator.dict;

    public validateEmail(email: string) {
        if (email.length > postAuthLoginBodyEmailMax) {
            return computed(() => this.dict().wrongEmailLength);
        }

        if (!postAuthLoginBodyEmailRegExp.test(email)) {
            return computed(() => this.dict().invalidEmail);
        }

        return computed(() => undefined);
    }

    public validatePassword(password: string) {
        const passwordSchema = postAuthLoginBody.shape.password;

        if (!passwordSchema.safeParse(password).success) {
            return computed(() =>
                this.dict().invalidPassword
            );
        }

        return computed(() => undefined);
    }

    public validateRepeatPassword(password: string, password2: string) {
        if (password !== password2) {
            return computed(() => this.dict().invalidRepeatPassword);
        }

        return computed(() => undefined);
    }

    public validateName(name: string) {
        const nameSchema = postAuthRegisterBody.shape.name;

        if (!nameSchema.safeParse(name).success) {
            return computed(() =>
                this.dict().invalidName
            );
        }

        return computed(() => undefined);
    }

    public validateUsername(username: string) {
        const usernameSchema = postAuthRegisterBody.shape.username;

        if (!usernameSchema.safeParse(username).success) {
            return computed(() => this.dict().invalidUsername);
        }

        return computed(() => undefined);
    }
}
