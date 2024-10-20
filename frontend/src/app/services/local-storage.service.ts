import { AbstractStorageService, StorageMap } from "./abstract-storage.service";
import { postAuthLoginResponse } from "../../apiCodegen/backend-zod";
import { inject, Injectable } from "@angular/core";
import { z } from "zod";
import { LanguageManagerService } from "./language-manager.service";

const localStorageMap = {
    userInfo: postAuthLoginResponse,
    language: z.enum(inject(LanguageManagerService).supportedLanguages),
} as const satisfies StorageMap;

@Injectable({
    providedIn: "root",
})
export class LocalStorageService extends AbstractStorageService<
    typeof localStorageMap
> {
    public override readonly storageMap = localStorageMap;
    protected override storage: Storage = localStorage;
}
