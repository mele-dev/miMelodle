import Axios, { AxiosRequestConfig } from "axios";
import QueryString from "qs";
import { getNextToken } from "./spotify-token.js";

export const AXIOS_INSTANCE = Axios.create({
    baseURL: "https://api.spotify.com/v1",
});

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

    (promise as any).cancel = () => {
        source.cancel("Query was cancelled");
    };

    return promise;
};
