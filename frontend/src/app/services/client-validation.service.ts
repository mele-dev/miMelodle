import { Injectable } from "@angular/core";
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
    dict = validationTranslator.getDict();
    constructor() {}

    public validateEmail(email: string) {
        if (email.length > postAuthLoginBodyEmailMax) {
            return this.dict.wrongEmailLength;
        }

        if (!postAuthLoginBodyEmailRegExp.test(email)) {
            return this.dict.invalidEmail;
        }

        return undefined;
    }

    public validatePassword(password: string) {
        const passwordSchema = postAuthLoginBody.shape.password;

        if (!passwordSchema.safeParse(password).success) {
            return this.dict.invalidPassword(
                postAuthLoginBodyPasswordMin,
                postAuthLoginBodyPasswordMax
            );
        }

        return undefined;
    }

    public validateRepeatPassword(password: string, password2 : string) {
        if (password !== password2) {
            return this.dict.invalidRepeatPassword;
        }

        return undefined;
    }

    public validateName(name: string) {
        const nameSchema = postAuthRegisterBody.shape.name;

        if (!nameSchema.safeParse(name).success) {
          return this.dict.invalidName(postAuthRegisterBodyNameMax)
        }

        return undefined;
    }
}
