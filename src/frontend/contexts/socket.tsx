import * as React    from "react";
import * as SocketIo from "socket.io-client";

import { DOMAIN } from "../../../config/frontend";

import { useUser } from "./user";
import { SOCKET_ACTIONS } from "../../constants";

const { useContext, createContext, useEffect, useState } = React;

const SocketContext = createContext(null);

// TODO: Refresh the socket connection on user signin

const SocketProvider: React.FunctionComponent = (props): React.ReactElement => {
    const { user }                  = useUser();
    const [isLoading, setIsLoading] = useState(true);
    if (window.socket) {
        window.socket.disconnect();
    }
    window.socket = SocketIo(DOMAIN, {
        transportOptions : {
            polling : {
                extraHeaders : { Authorization : `Bearer ${user && user.token}` }
            }
        }
    });

    return <SocketContext.Provider value={{ socket : window.socket, isLoading }} { ...props } />;
}

function useSocket() {
    const context = useContext<{ socket : SocketIOClient.Socket, isLoading : boolean }>(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a component that's rendered within the SocketProvider");
    }
    return context;
}

export {
    SocketProvider,
    useSocket
};