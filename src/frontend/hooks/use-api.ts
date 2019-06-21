import { useState, useEffect } from "react";
import { AxiosRequestConfig }  from "axios";

import api from "../api";

const useApi = (config: AxiosRequestConfig, deps = []) => {
    const [data, setData]           = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError]         = useState(false);

    useEffect(() => {
        api(config)
            .then(({ data }) => {
                setData(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    }, deps);

    return { data, isLoading, error };
};

export default useApi;