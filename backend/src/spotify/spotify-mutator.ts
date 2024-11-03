import Axios, { AxiosRequestConfig } from "axios";
import QueryString from "qs";
import { getNextToken } from "./spotify-token.js";

export const AXIOS_INSTANCE = Axios.create({ baseURL: "<BACKEND URL>" }); // use your own URL here or environment variable

// add a second `options` argument here if you want to pass extra options to each generated query

export const customInstance = async <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig
): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        paramsSerializer: (params) => {
            const output = QueryString.stringify(params, {
                arrayFormat: "repeat",
            });
            return output;
        },
        ...config,
        headers: {
            ...config.headers,
            Authorization: `Bearer ${await getNextToken()}`,
        },
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    // @ts-ignore
    promise.cancel = () => {
        source.cancel("Query was cancelled");
    };

    return promise;
};

//const api = axios.create({
//    baseURL: "your-api-url",
//    paramsSerializer: (params) =>
//        qs.stringify(params, {
//            arrayFormat: "repeat",
//        }),
//});
//
//// Now every request through this instance will use this serialization
//export default api;
