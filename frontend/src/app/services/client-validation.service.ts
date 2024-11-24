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
            return (await schema.safeParseAsync(control.value)).error ===
                undefined
                ? null
                : { schemaError: true };
        };
    }

    /**
     * @param group
     * Group is expected to be a formgroup with repeatPassword and password
     */
    public validateRepeatPassword(group: {
        value: unknown;
    }): ValidationErrors | null {
        const schema = z.object({
            password: z.string(),
            repeatPassword: z.string(),
        });

        const value = schema.safeParse(group.value);

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

            if (!result.emailExists) {
                return null;
            }

            return { emailExists: result.emailExists };
        } catch {
            return { serverError: true };
        }
    }

    public async validateUniqueUsername(control: { value: string }) {
        try {
            const result = await getUsersCheck({ username: control.value });

            if (!result.usernameExists) {
                return null;
            }

            return { usernameExists: result.usernameExists };
        } catch {
            return { serverError: true };
        }
    }

    public mustMatch<TErrorName extends string>(
        errorName: TErrorName,
        siblingsToMatch: string[]
    ) {
        return function (group: AbstractControl) {
            if (!(group instanceof FormGroup)) {
                return { isNotFormGroup: true };
            }

            const children = group.controls;

            const relevantChildren = siblingsToMatch.map(
                (key) => children[key]
            );

            const allElementsMatch = relevantChildren.every(
                (child) => child.value === relevantChildren[0].value
            );

            // Set error to group and children in error case;
            if (!allElementsMatch) {
                const error = { [errorName]: true } as Record<TErrorName, true>;

                for (const child of relevantChildren) {
                    child.setErrors({ ...child.errors, ...error });
                }

                return error;
            }

            // Clean error in happy case
            for (const child of relevantChildren) {
                const errors = { ...child.errors };
                delete errors[errorName];

                child.setErrors(Object.keys(errors).length ? errors : null);
            }

            return null;
        };
    }
}
