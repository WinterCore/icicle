import { useState, useEffect } from "react";
import Axios, { AxiosRequestConfig } from "axios";

import api from "../api";

const useApi = (config: AxiosRequestConfig, deps = []) => {
    const [data, setData]           = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError]         = useState<boolean>(false);

    useEffect(() => {
        const cancelTokenSource = Axios.CancelToken.source();
        setIsLoading(true);
        setError(false);
        api({ ...config, cancelToken : cancelTokenSource.token })
            .then(({ data }) => {
                setData(data);
                setIsLoading(false);
            })
            .catch((err) => {
                if (err.message !== "CANCELED") {
                    setError(err);
                    setIsLoading(false);
                }
            });
        return () => {
            cancelTokenSource.cancel("CANCELED");
        };
    }, deps);

    return { data, isLoading, error };
};

export default useApi;