import { Injectable } from "@angular/core";
import { z } from "zod";
import { postAuthLoginResponse } from "../../apiCodegen/backend-zod";

// All of the values mapped here must be coerced from strings, because the
// querystring returns strings.
const queryParamsMaps = {
    jwtToken: postAuthLoginResponse.shape.jwtToken,
    selfId: z.coerce.number(),
    code: z.coerce.number(),
    targetUrl: z.string().url(),
} as const satisfies Record<string, z.ZodString | z.ZodNumber>;

type QueryParamsMaps = typeof queryParamsMaps;
export type MelodleQueryParams = {
    [K in keyof QueryParamsMaps]: z.infer<QueryParamsMaps[K]>;
};

@Injectable({
    providedIn: "root",
})
export class QueryParamsService {
    async coerce<TKeys extends (keyof QueryParamsMaps & string)[]>(
        // I ask for the params because I couldnt get them from within a service
        // for some reason. Maybe FIXME someday.
        params: Record<string, string>,
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
