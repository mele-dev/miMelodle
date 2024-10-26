import { inject, Injectable } from "@angular/core";
import { QueryParamsService } from "../query-params.service";
import { QueryStringHandlerTranslator } from "./query-string-handler.translations";
import { z } from "zod";

export const queryStringErrorSchema = z.enum([
    "spotify_taken",
    "invalid_credentials",
    "no_user_spotify",
]);
export type QueryStringErrorEnum = z.infer<typeof queryStringErrorSchema>;

@Injectable({
    providedIn: "root",
})
export class QueryStringHandlerService {
    private readonly _queryParamService = inject(QueryParamsService);
    private readonly _dict = inject(QueryStringHandlerTranslator).dict;

    private _handleUnknownError(error: string) {
        alert("Unknown error from backend: " + error);
    }

    listen() {
        this._queryParamService
            .getCoercedQueryParamsObserver(["errorEnum"])
            .subscribe(async (error) => {
                const parsedEnum = await queryStringErrorSchema.safeParseAsync(
                    error.errorEnum
                );

                if (parsedEnum.success) {
                    alert(this._dict()[parsedEnum.data]);
                } else {
                    this._handleUnknownError(error.errorEnum);
                }

                this._queryParamService.safeRemove(["errorEnum"]);
            });

        this._queryParamService
            .getCoercedQueryParamsObserver(["errorMessage"])
            .subscribe(async (error) => {
                this._handleUnknownError(error.errorMessage);
                this._queryParamService.safeRemove(["errorMessage"]);
            });
    }
}
