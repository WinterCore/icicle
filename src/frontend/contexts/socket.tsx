import * as React    from "react";
import * as SocketIo from "socket.io-client";

import { DOMAIN } from "../../../config/frontend";

import { useUser } from "./user";

const { useContext, createContext, useMemo } = React;

const SocketContext = createContext(null);

// TODO: Refresh the socket connection on user signin

const SocketProvider: React.FunctionComponent = (props): React.ReactElement => {
    const { user } = useUser();


    const socket = useMemo(() => {
        return SocketIo(DOMAIN, {
            transportOptions : {
                polling : {
                    extraHeaders : { Authorization : `Bearer ${user && user.token}` }
                }
            }
        });
    }, [user]);

    return <SocketContext.Provider value={ socket } { ...props } />;
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