import * as React from "react";

import { UserProvider }         from "./user";
import { SocketProvider }       from "./socket";
import { PlayerProvider }       from "./player";
import { NotificationProvider } from "./notification";
import { PlaylistsProvider }    from "./playlists";

const AppProviders: React.SFC<AppProvidersProps> = ({ children }): React.ReactElement => {
    return (
        <UserProvider>
            <SocketProvider>
                <NotificationProvider>
                    <PlayerProvider>
                        <PlaylistsProvider>
                            { children }
                        </PlaylistsProvider>
                    </PlayerProvider>
                </NotificationProvider>
            </SocketProvider>
        </UserProvider>
    );
};

interface AppProvidersProps {
    children : React.ReactNode;
}

export default AppProviders;