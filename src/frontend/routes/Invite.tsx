import * as React             from "react";

import { useSocket } from "../contexts/socket";
import { SOCKET_ACTIONS } from "../../constants";
import {useNavigate, useParams} from "react-router";

type Params = {
    token: string;
};

const Invite: React.FC = () => {
    const { isLoading } = useSocket();
    const match = useParams();
    const token = match.token;
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!isLoading) {
            window.socket.emit(SOCKET_ACTIONS.INVITE_JOIN, token);
            navigate("/");
        }
    }, [isLoading, navigate]);
    return null;
};

export default Invite;
