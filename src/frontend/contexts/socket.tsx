import * as React    from "react";
import * as SocketIo from "socket.io-client";

import { DOMAIN } from "../../../config/frontend";

import usePrevious from "../hooks/use-previous";

import { useUser } from "./user";

const { useContext, createContext, useState } = React;

const SocketContext = createContext(null);

const SocketProvider: React.FunctionComponent = (props): React.ReactElement => {
    const { user }                  = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const prevUser                  = usePrevious(user);
    const [socket, setSocket]       = useState(() => (
        SocketIo(DOMAIN, {
            transportOptions : {
                polling : {
                    extraHeaders : { Authorization : `Bearer ${user && user.token}` }
                }
            }
        })
    ));
    React.useLayoutEffect(() => {
        if (!!prevUser !== !!user) {
            setSocket(socket => {
                return SocketIo(DOMAIN, {
                    transportOptions : {
                        polling : {
                            extraHeaders : { Authorization : `Bearer ${user && user.token}` }
                        }
                    }
                });
            });
            return () => socket.disconnect();
        }
    }, [!!user]);

    return <SocketContext.Provider value={{ socket, isLoading }} { ...props } />;
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