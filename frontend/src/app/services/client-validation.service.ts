import { inject, Injectable } from "@angular/core";
import { ValidationTranslator } from "./client-validation.translation";
import { AbstractControl, FormGroup, ValidationErrors } from "@angular/forms";
import { z, ZodSchema } from "zod";
import { getUsersCheck } from "../../apiCodegen/backend";

@Injectable({
    providedIn: "root",
})
export class ClientValidationService {
    private translator = inject(ValidationTranslator);
    dict = this.translator.dict;

    public Schema(schema: ZodSchema) {
        return async function (control: { value: unknown }) {
            return (await schema.safeParseAsync(control.value)).error ?? null;
        };
    }

    /**
     * @param group
     * Group is expected to be a formgroup with repeatPassword and password
     */
    public validateRepeatPassword(
        group: AbstractControl
    ): ValidationErrors | null {
        const schema = z.object({
            password: z.string(),
            repeatPassword: z.string(),
        });
        const value = schema.safeParse(group.getRawValue());

        if (!value.success) {
            console.error(
                "Could not parse repeat password schema.",
                value.error
            );
            return { error: value.error };
        }

        if (value.data.password !== value.data.repeatPassword) {
            return { differentRepeatedPassword: true };
        }
        return null;
    }

    public async validateUniqueEmail(control: { value: string }) {
        try {
            const result = await getUsersCheck({ email: control.value });

            if (!result.data.emailExists) {
                return null;
            }

            return { emailExists: result.data.emailExists };
        } catch {
            return { serverError: true };
        }
    }

    public async validateUniqueUsername(control: { value: string }) {
        try {
            const result = await getUsersCheck({ username: control.value });

            if (!result.data.usernameExists) {
                return null;
            }
            return { usernameExists: result.data.usernameExists };
        } catch {
            return { serverError: true };
        }
    }
}
