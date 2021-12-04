import * as React             from "react";

import { useUser } from "../contexts/user";

import api, { CONFIRM_GOOGLE_LOGIN } from "../api";
import {useNavigate} from "react-router";
import {useSearchParams} from "react-router-dom";

const ConfirmLogin: React.FC = () => {
    const { login } = useUser();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    React.useEffect(() => {
        const code = searchParams.get('code');
        if (!code) return navigate("/");
        api({ ...CONFIRM_GOOGLE_LOGIN(), params : { code } })
            .then(({ data : { data } }) => {
                login(data);
                navigate("/");
            }).catch(() => {
                alert("Something happened while connecting to the server, Please try to login again by clicking the button on the left");
                navigate("/");
            });
    }, []);

    return (
        <div className="flex-middle">
            <h1>Confirming your login...</h1>
        </div>
    );
};


export default ConfirmLogin;
