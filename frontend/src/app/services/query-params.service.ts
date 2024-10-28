import { inject, Injectable } from "@angular/core";
import { z } from "zod";
import { postAuthLoginResponse } from "../../apiCodegen/backend-zod";
import { ActivatedRoute, Params } from "@angular/router";
import { filter, from, map, switchMap } from "rxjs";
import { SafeRoutingService } from "./safe-routing.service";

// All of the values mapped here must be coerced from strings, because the
// querystring returns strings.
const queryParamsMaps = {
    jwtToken: postAuthLoginResponse.shape.jwtToken,
    selfId: z.coerce.number(),
    errorEnum: z.string(),
    errorMessage: z.string(),
} as const satisfies Record<string, z.Schema>;

type QueryParamsMaps = typeof queryParamsMaps;
export type MelodleQueryParams = {
    [K in keyof QueryParamsMaps]: z.infer<QueryParamsMaps[K]>;
};

@Injectable({
    providedIn: "root",
})
export class QueryParamsService {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(SafeRoutingService);

    get queryParams() {
        return this.route.queryParams;
    }

    safeRemove(params: (keyof QueryParamsMaps & string)[]) {
        return this.remove(params);
    }

    remove(params: string[]) {
        const mappedParams = Object.fromEntries(params.map((p) => [p, null]));

        this.router.navigate([], {
            relativeTo: this.route,
            queryParams: mappedParams,
            queryParamsHandling: "merge",
            replaceUrl: true,
        });
    }

    /**
     * This observer is called whenever angular parses queryParams that match
     * the schema of the specified keys.
     */
    getCoercedQueryParamsObserver<
        TKeys extends (keyof QueryParamsMaps & string)[],
    >(keys: TKeys) {
        return this.queryParams.pipe(
            switchMap((v) => from(this.coerce(v, keys))),
            filter((v) => v.success),
            map((v) => v.data)
        );
    }

    async coerce<TKeys extends (keyof QueryParamsMaps & string)[]>(
        // I ask for the params because I couldnt get them from within a service
        // for some reason. Maybe FIXME someday.
        params: Params,
        keys: TKeys
    ) {
        const schema = z.object(
            Object.fromEntries(
                keys.map((key) => [key, queryParamsMaps[key]])
            ) as Pick<QueryParamsMaps, TKeys[number]>
        );
        return await schema.safeParseAsync(params);
    }

    async get<TKeys extends (keyof QueryParamsMaps & string)[]>(
        // I ask for the params because I couldnt get them from within a service
        // for some reason. Maybe FIXME someday.
        params: Record<string, string>,
        keys: TKeys
    ) {
        const schema = z.object(
            Object.fromEntries(keys.map((key) => [key, z.string()])) as {
                [K in TKeys[number]]: z.ZodString;
            }
        );
        return await schema.safeParseAsync(params);
    }
}
