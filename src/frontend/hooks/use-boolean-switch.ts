import { useState, useMemo, useEffect } from "react";
import { AxiosRequestConfig }           from "axios";

import api from "../api";

interface UseBooleanSwitch {
    isLoading : boolean;
    error     : boolean;
    success   : boolean;
    state     : boolean;

    updateState(val: boolean) : void;
}

const useBooleanSwitch = (defaultValue: boolean, endpoint, name: string): UseBooleanSwitch => {
    const [state, setState]         = useState<boolean>(defaultValue);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError]         = useState<boolean>(false);
    const [success, setSuccess]     = useState<boolean>(false);

    const updateState = useMemo(() => (val: boolean) => {
        setIsLoading(true);
        setError(false);
        setState(val);
        setSuccess(false);
        api({ ...endpoint(), data : { [name] : val } })
            .then(() => {
                setIsLoading(false);
                setSuccess(true);
            })
            .catch((err) => {
                if (err.message !== "CANCELED") {
                    console.log(err);
                    setError(true);
                    setIsLoading(false);
                    setState(!val);
                }
            });
    }, []);

    useEffect(() => {
        if (defaultValue !== state) setState(defaultValue);
    }, [defaultValue]);

    return { updateState, state, isLoading, error, success };
};

export default useBooleanSwitch;