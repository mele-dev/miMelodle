import { AbstractStorageService, StorageMap } from "./abstract-storage.service";
import { postAuthLoginResponse } from "../../apiCodegen/backend-zod";
import { Injectable } from "@angular/core";
import { z } from "zod";
import { supportedLanguages } from "../globalConstants";

const localStorageMap = {
    userInfo: postAuthLoginResponse,
    language: z.enum(supportedLanguages),
} as const satisfies StorageMap;

@Injectable({
    providedIn: "root",
})
export class LocalStorageService extends AbstractStorageService<
    typeof localStorageMap
> {
    public override readonly storageMap = localStorageMap;
    protected override storage = localStorage;
}
