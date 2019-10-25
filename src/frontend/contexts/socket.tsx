import * as React    from "react";
import * as SocketIo from "socket.io-client";

import { DOMAIN } from "../../../config/frontend";

import usePrevious from "../hooks/use-previous";

import { useUser } from "./user";
import { SOCKET_ACTIONS } from "../../constants";

const { useContext, createContext, useState } = React;

const SocketContext = createContext<SocketProvider | null>(null);

interface SocketProvider {
    isLoading : boolean;
}

const options = {
    transports: ["websocket"],
    upgrade : false
};

const SocketProvider: React.FunctionComponent = (props): React.ReactElement => {
    const { user }                  = useUser();
    const [isLoading, setIsLoading] = useState(true);
    if (!window.socket) {
        window.socket = SocketIo(DOMAIN, options);
        window.socket.on(SOCKET_ACTIONS.AUTHENTICATED, () => setIsLoading(false));
    }
    React.useLayoutEffect(() => {
        setIsLoading(true);
        window.socket.emit(SOCKET_ACTIONS.AUTHENTICATE, user ? user.token : null);
    }, [!!user]);

    return <SocketContext.Provider value={{ isLoading }} { ...props } />;
}

function useSocket() {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a component that's rendered within the SocketProvider");
    }
    return context;
}

export {
    SocketProvider,
    useSocket
};