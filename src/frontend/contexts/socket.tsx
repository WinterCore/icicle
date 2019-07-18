import * as React    from "react";
import * as SocketIo from "socket.io-client";

import { DOMAIN } from "../../../config/frontend";

import { useUser } from "./user";

const { useContext, createContext, useState } = React;

const SocketContext = createContext(null);

const SocketProvider: React.FunctionComponent = (props): React.ReactElement => {
    const { user }                  = useUser();
    const [isLoading, setIsLoading] = useState(true);
    if (window.socket) {
        window.socket.disconnect();
    } else {
        window.socket = SocketIo(DOMAIN, {
            transportOptions : {
                polling : {
                    extraHeaders : { Authorization : `Bearer ${user && user.token}` }
                }
            }
        });
    }

    React.useLayoutEffect(() => {
        window.socket = SocketIo(DOMAIN, {
            transportOptions : {
                polling : {
                    extraHeaders : { Authorization : `Bearer ${user && user.token}` }
                }
            }
        });
    }, [!!user]);

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