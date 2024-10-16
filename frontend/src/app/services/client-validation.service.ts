import { computed, Injectable } from "@angular/core";
import {
    postAuthLoginBody,
    postAuthLoginBodyEmailMax,
    postAuthLoginBodyEmailRegExp,
    postAuthLoginBodyPasswordMax,
    postAuthLoginBodyPasswordMin,
    postAuthRegisterBody,
    postAuthRegisterBodyNameMax,
} from "../../apiCodegen/backend-zod";
import { validationTranslator } from "./client-validation.translation";

@Injectable({
    providedIn: "root",
})
export class ClientValidationService {
    dict = validationTranslator.dict;
    constructor() {}

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
                this.dict().invalidPassword(
                    postAuthLoginBodyPasswordMin,
                    postAuthLoginBodyPasswordMax
                )
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
                this.dict().invalidName(postAuthRegisterBodyNameMax)
            );
        }

        return computed(() => undefined);
    }
}
