import Axios, { AxiosRequestConfig } from "axios";
import QueryString from "qs";
import { enviroment } from "../enviroments";

export const AXIOS_INSTANCE = Axios.create({
    baseURL: `https://${enviroment.front_url}/backend`,
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
        ...options,
        cancelToken: source.token,
    }).then(({ data }) => data);

    (promise as any).cancel = () => {
        source.cancel("Query was cancelled");
    };

    return promise;
};
