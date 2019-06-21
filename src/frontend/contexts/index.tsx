import * as React from "react";

import { UserProvider }   from "./user";
import { SocketProvider } from "./socket";
import { PlayerProvider } from "./player";

const AppProviders: React.SFC<AppProvidersProps> = ({ children }): React.ReactElement => {
    return (
        <UserProvider>
            <SocketProvider>
                <PlayerProvider>
                    { children }
                </PlayerProvider>
            </SocketProvider>
        </UserProvider>
    );
};

interface AppProvidersProps {
    children : React.ReactNode[]
}

export default AppProviders;