import * as React    from "react";

import { useSocket } from "./socket";
import { SOCKET_ACTIONS } from "../../constants";
import { useUser } from "./user";

const { useContext, createContext, useState, useMemo, useEffect } = React;

const PlayerContext = createContext(null);

interface PlayerProvider {
    onRoomJoin (data: PlayerData) : void
    onRoomLeave()                 : void
    onSeek     (seconds: number)  : void
    onPause    ()                 : void
    onPlay     ()                 : void

    nowPlaying : PlayerData
}

const PlayerProvider: React.FunctionComponent = (props): React.ReactElement => {
    const [data, setData] = useState<PlayerData | null>(null);
    const { user }        = useUser();
    const socket = useSocket();

    const context = useMemo<PlayerProvider>(() => {
        const onRoomJoin  = (data: PlayerData) => { setData({ ...data }); };
        const onRoomLeave = ()                 => { setData(null); };
        const onSeek      = (seconds: number)  => {
            socket.emit(SOCKET_ACTIONS.SEEK, seconds);
        };
        const onPause     = ()                 => { setData({ ...data, isPaused : true }); };
        const onPlay      = ()                 => { setData({ ...data, isPaused : false }); };

        return {
            onRoomJoin,
            onRoomLeave,
            onSeek,
            onPause,
            onPlay,
            nowPlaying : data
        };
    }, [data]);

    useEffect(() => {
        socket.on(SOCKET_ACTIONS.PLAY_NOW, context.onRoomJoin);

        return () => {
            socket.off(SOCKET_ACTIONS.PLAY_NOW, context.onRoomJoin);
        };
    }, []);


    return <PlayerContext.Provider value={ context } { ...props } />;
}

function usePlayer(): PlayerProvider {
    const context = useContext<PlayerProvider>(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within a component that's rendered within the PlayerProvider");
    }
    return context;
}

export {
    PlayerProvider,
    usePlayer
};