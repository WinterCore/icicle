import * as React from "react";

import { UserProvider }   from "./user";
import { SocketProvider } from "./socket";
import { PlayerProvider } from "./player";
import { NotificationProvider } from "./notification";

const AppProviders: React.SFC<AppProvidersProps> = ({ children }): React.ReactElement => {
    return (
        <NotificationProvider>
            <UserProvider>
                <SocketProvider>
                    <PlayerProvider>
                        { children }
                    </PlayerProvider>
                </SocketProvider>
            </UserProvider>
        </NotificationProvider>
    );
};

interface AppProvidersProps {
    children : React.ReactNode[];
}

export default AppProviders;