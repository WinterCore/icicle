import * as React from "react";

import { UserProvider }         from "./user";
import { SocketProvider }       from "./socket";
import { PlayerProvider }       from "./player";
import { NotificationProvider } from "./notification";
import { PlaylistsProvider }    from "./playlists";

const AppProviders: React.SFC<AppProvidersProps> = ({ children }): React.ReactElement => {
    return (
        <NotificationProvider>
            <UserProvider>
                <SocketProvider>
                    <PlayerProvider>
                        <PlaylistsProvider>
                            { children }
                        </PlaylistsProvider>
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