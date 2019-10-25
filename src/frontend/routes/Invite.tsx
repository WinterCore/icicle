import * as React             from "react";
import { RouteComponentProps } from "react-router";

import { useSocket } from "../contexts/socket";
import { SOCKET_ACTIONS } from "../../constants";

type Params = {
    token: string;
};

const Invite: React.FunctionComponent<RouteComponentProps<Params>> = ({ match : { params : { token } }, history }) => {
    const { isLoading } = useSocket();
    React.useEffect(() => {
        if (!isLoading) {
            window.socket.emit(SOCKET_ACTIONS.INVITE_JOIN, token);
            history.push("/");
        }
    }, [isLoading]);
    return null;
};

export default Invite;