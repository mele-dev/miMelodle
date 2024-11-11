import { Component, inject, input, signal } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { HlmBadgeDirective } from "@spartan-ng/ui-badge-helm";
import { HlmButtonDirective } from "@spartan-ng/ui-button-helm";
import {
    HlmCardContentDirective,
    HlmCardDescriptionDirective,
    HlmCardDirective,
    HlmCardFooterDirective,
    HlmCardHeaderDirective,
    HlmCardTitleDirective,
} from "@spartan-ng/ui-card-helm";
import { HlmInputDirective } from "@spartan-ng/ui-input-helm";
import { HlmLabelDirective } from "@spartan-ng/ui-label-helm";
import {
    HlmTabsComponent,
    HlmTabsContentDirective,
    HlmTabsListComponent,
    HlmTabsTriggerDirective,
    HlmTabsPaginatedListComponent,
} from "@spartan-ng/ui-tabs-helm";
import { BrnSelectImports } from "@spartan-ng/ui-select-brain";
import { HlmSelectImports } from "@spartan-ng/ui-select-helm";
import {
    AbstractControl,
    FormBuilder,
    ReactiveFormsModule,
} from "@angular/forms";
import { ClientValidationService } from "../../services/client-validation.service";
import { putUsersSelfSelfIdBody } from "../../../apiCodegen/backend-zod";
import { PutUsersSelfSelfIdBody } from "../../../apiCodegen/backend";
import { BackendIcon } from "../../types/backend-icon";
import { SelfService } from "../../services/self.service";

@Component({
    selector: "app-user-config",
    standalone: true,
    imports: [
        ReactiveFormsModule,

        HlmTabsComponent,
        HlmTabsListComponent,
        HlmTabsTriggerDirective,
        HlmTabsContentDirective,
        HlmTabsPaginatedListComponent,

        HlmCardContentDirective,
        HlmCardDescriptionDirective,
        HlmCardDirective,
        HlmCardFooterDirective,
        HlmCardHeaderDirective,
        HlmCardTitleDirective,

        HlmLabelDirective,
        HlmInputDirective,
        HlmButtonDirective,
        HlmBadgeDirective,

        BrnSelectImports,
        HlmSelectImports,
    ],
    templateUrl: "./user-config.page.html",
})
export class UserConfigPage {
    private _validator = inject(ClientValidationService);
    chosenIcon = signal<BackendIcon | undefined>(undefined);
    private _selfService = inject(SelfService);

    private schema = putUsersSelfSelfIdBody;
    private builder = new FormBuilder().nonNullable;

    user = this.builder.group(
        {
            name: this.builder.control(
                "",
                [],
                this._validator.Schema(this.schema.shape.name)
            ),
            username: this.builder.control("", [], this.validateUsername()),
            email: this.builder.control("", [], [this.validateEmail()]),
            profilePictureId: this.builder.control(
                this.chosenIcon()?.id ?? -1,
                [],
                this._validator.Schema(this.schema.shape.profilePictureId)
            ),
        } satisfies Partial<{ [k in keyof PutUsersSelfSelfIdBody]: unknown }>,
        {
            asyncValidators: this._validator.Schema(this.schema),
        }
    );

    activeTab = input("Tab 0");

    lotsOfTabs = Array.from({ length: 30 })
        .fill(0)
        .map((_, index) => `Tab ${index}`);

    sanitizer = inject(DomSanitizer);

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
}
