import { AbstractStorageService, StorageMap } from "./abstract-storage.service";
import { Injectable } from "@angular/core";

const sessionStorageMap = {
} as const satisfies StorageMap;

@Injectable({
    providedIn: "root",
})
export class SessionStorageService extends AbstractStorageService<
    typeof sessionStorageMap
> {
    public override readonly storageMap = sessionStorageMap;
    protected override storage = sessionStorage;
}
