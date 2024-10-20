import { inject, Injectable } from "@angular/core";
import { ValidationTranslator } from "./client-validation.translation";
import { ValidationErrors } from "@angular/forms";
import { ZodSchema } from "zod";

@Injectable({
    providedIn: "any",
})
export class ClientValidationService {
    private translator = inject(ValidationTranslator);
    dict = this.translator.dict;

    public Schema(schema: ZodSchema) {
        return async function (control: { value: unknown }) {
            return (await schema.safeParseAsync(control.value)).error ?? null;
        };
    }

    public validateRepeatPassword(
        password: string,
        password2: string
    ): ValidationErrors | null {
        if (password !== password2) {
            return { error: this.dict().invalidRepeatPassword };
        }

        return null;
    }
}
