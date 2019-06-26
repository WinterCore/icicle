import * as React             from "react";
import { RouteChildrenProps } from "react-router";
import { parse }              from "query-string";

import { useUser } from "../contexts/user";

import api, { CONFIRM_GOOGLE_LOGIN } from "../api";
import { useSocket } from "../contexts/socket";

const ConfirmLogin: React.FunctionComponent<RouteChildrenProps> = ({ location : { search }, history }) => {
    const { login } = useUser();
    React.useEffect(() => {
        const { code } = parse(search);
        if (!code) return history.push("/");
        api({ ...CONFIRM_GOOGLE_LOGIN(), params : { code } })
            .then(({ data : { data } }) => {
                login(data);
                history.push("/");
            }).catch(() => {
                alert("Something happened while connecting to the server, Please try to login again by clicking the button on the left");
                history.push("/");
            });
    }, []);

    return (
        <h1>Loading...</h1>
    );
};


export default ConfirmLogin;