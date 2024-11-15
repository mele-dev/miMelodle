import {
    Component,
    effect,
    inject,
    input,
    OnInit,
    signal,
} from "@angular/core";
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
import {
    deleteUsersSelfSelfId,
    getPublicIcons,
    getPublicIconsFilename,
    putUsersSelfSelfId,
    PutUsersSelfSelfIdBody,
} from "../../../apiCodegen/backend";
import { BackendIcon } from "../../types/backend-icon";
import { SelfService } from "../../services/self.service";
import { LocalStorageService } from "../../services/local-storage.service";
import {
    BrnDialogContentDirective,
    BrnDialogTriggerDirective,
} from "@spartan-ng/ui-dialog-brain";
import {
    HlmDialogComponent,
    HlmDialogContentComponent,
    HlmDialogDescriptionDirective,
    HlmDialogFooterComponent,
    HlmDialogHeaderComponent,
    HlmDialogTitleDirective,
} from "@spartan-ng/ui-dialog-helm";
import { SafeRoutingService } from "../../services/safe-routing.service";
import { toast } from "ngx-sonner";
import { HlmSpinnerComponent } from "@spartan-ng/ui-spinner-helm";
import { IconPickerComponent } from "../../auth/register-page/icon-picker/icon-picker.component";
import { TickCircleIconComponent } from "../../icons/tick-circle-icon/tick-circle-icon.component";
import {
    BrnPopoverCloseDirective,
    BrnPopoverComponent,
    BrnPopoverContentDirective,
    BrnPopoverTriggerDirective,
} from "@spartan-ng/ui-popover-brain";
import {
    HlmPopoverCloseDirective,
    HlmPopoverContentDirective,
} from "@spartan-ng/ui-popover-helm";
import { throwDialogContentAlreadyAttachedError } from "@angular/cdk/dialog";

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

        BrnDialogTriggerDirective,
        BrnDialogContentDirective,

        HlmDialogComponent,
        HlmDialogContentComponent,
        HlmDialogHeaderComponent,
        HlmDialogFooterComponent,
        HlmDialogTitleDirective,
        HlmDialogDescriptionDirective,

        HlmLabelDirective,
        HlmInputDirective,
        HlmButtonDirective,

        HlmSpinnerComponent,
        IconPickerComponent,
        TickCircleIconComponent,

        //popover
        BrnPopoverComponent,
        BrnPopoverTriggerDirective,
        BrnPopoverContentDirective,
        BrnPopoverCloseDirective,
        HlmPopoverContentDirective,
        HlmPopoverCloseDirective,
    ],
    templateUrl: "./user-config.page.html",
})
export class UserConfigPage implements OnInit {
    private _validator = inject(ClientValidationService);
    private _localStorage = inject(LocalStorageService);
    chosenIcon = signal<BackendIcon | undefined>(undefined);
    public selfService = inject(SelfService);
    public userIconSVG = "";
    public userInfo = this.selfService.getUserInfo();
    public safeRouter = inject(SafeRoutingService);
    allIcons?: BackendIcon[];

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
            oldPassword: this.builder.control(
                "",
                [],
                this._validator.Schema(this.schema.shape.oldPassword)
            ),
        } satisfies Partial<{ [k in keyof PutUsersSelfSelfIdBody]: unknown }>,
        {
            asyncValidators: this._validator.Schema(this.schema),
        }
    );

    changePasasword = this.builder.group(
        {
            password: this.builder.control(
                "",
                [],
                this._validator.Schema(this.schema.shape.password)
            ),
            oldPassword: this.builder.control(
                "",
                [],
                this._validator.Schema(this.schema.shape.oldPassword)
            ),
        } satisfies Partial<{
            [k in keyof PutUsersSelfSelfIdBody]: unknown;
        }>,
        {
            asyncValidators: this._validator.Schema(this.schema),
        }
    );

    activeTab = input("Tab 0");

    lotsOfTabs = Array.from({ length: 30 })
        .fill(0)
        .map((_, index) => `Tab ${index}`);

    sanitizer = inject(DomSanitizer);

    constructor() {
        effect(async () => {
            this.userIconSVG = (await this.selfService.userIconSVG()) ?? "";
            this.user.patchValue({
                profilePictureId: this.chosenIcon()?.id ?? -1,
            });
        });
    }

    private validateUsername() {
        const thisBinding = this;
        return async function (control: AbstractControl) {
            if (
                control.value ===
                (await thisBinding.selfService.waitForUserInfoSnapshot())
                    .username
            ) {
                return null;
            }
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
            if (
                control.value ===
                (await thisBinding.selfService.waitForUserInfoSnapshot()).email
            ) {
                return null;
            }
            return (
                (await thisBinding._validator.Schema(
                    thisBinding.schema.shape.email
                )(control)) ??
                (await thisBinding._validator.validateUniqueEmail(control))
            );
        };
    }

    async onSubmit() {
        try {
            const userInfo = await this.selfService.waitForUserInfoSnapshot();
            const result = await putUsersSelfSelfId(userInfo.id, {
                ...this.user.getRawValue(),
                password: this.user.getRawValue().oldPassword,
            });
            this.safeRouter.navigate(["/app"]);
        } catch (e) {
            console.error(e);
            toast("Failed to change user configs.");
        }
    }

    async ngOnInit(): Promise<void> {
        const iconsInfo = (await getPublicIcons()).data;
        const userInfo = await this.selfService.waitForUserInfoSnapshot();

        this.allIcons = await Promise.all(
            iconsInfo.map(async (icon) => ({
                svg: await (
                    await getPublicIconsFilename(icon.filename)
                ).data.text(),
                ...icon,
            }))
        );

        this.chosenIcon.set(
            this.allIcons.find((v) => v.id === userInfo.profilePictureId)
        );
    }

    public async changePassword() {
        try {
            const userInfo = await this.selfService.waitForUserInfoSnapshot();
            const result = await putUsersSelfSelfId(userInfo.id, {
                ...this.changePasasword.getRawValue(),
                email: userInfo.email,
                name: userInfo.name,
                profilePictureId: userInfo.profilePictureId,
                username: userInfo.username,
            });
            this.selfService.logOut();
        } catch (e) {
            console.error(e);
            toast("Failed to change password.");
        }
    }

    public async deleteAccount() {
        try {
            const userInfo = await this.selfService.waitForUserInfoSnapshot();
            const result = await deleteUsersSelfSelfId(userInfo.id);
            this.selfService.logOut();
            toast("Account deleted successfully.");
        } catch (e) {
            console.error(e);
            toast("Failed to delete account.");
        }
    }
}
