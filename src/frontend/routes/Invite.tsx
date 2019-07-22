import * as React             from "react";
import { RouteChildrenProps } from "react-router";

import { useSocket } from "../contexts/socket";
import { SOCKET_ACTIONS } from "../../constants";

type Params = {
    token: string;
};

const Invite: React.FunctionComponent<RouteChildrenProps<Params>> = ({ match : { params : { token } }, history }) => {
    const { socket } = useSocket();
    React.useEffect(() => {
        socket.emit(SOCKET_ACTIONS.INVITE_JOIN, token);
        history.push("/");
    }, []);
    return null;
};

export default Invite;