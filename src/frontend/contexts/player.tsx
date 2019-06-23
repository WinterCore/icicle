import * as React    from "react";

import { useSocket } from "./socket";
import { SOCKET_ACTIONS } from "../../constants";

const { useContext, createContext, useState, useMemo, useEffect } = React;

const PlayerContext = createContext(null);

interface PlayerProvider {
    onRoomJoin  (data: PlayerData) : void;
    onRoomLeave()                  : void;
    seek        (seconds: number)  : void;
    startStream (id: string)       : void;
    leaveStream (id: string)       : void;
    joinStream  (id: string)       : void;

    nowPlaying : PlayerData;
}

const PlayerProvider: React.FunctionComponent = (props): React.ReactElement => {
    const [data, setData] = useState<PlayerData | null>(null);
    const socket          = useSocket();

    const context = useMemo<PlayerProvider>(() => {
        const onRoomJoin  = (data: PlayerData) => {
            setData({ ...data });
        };
        const onRoomLeave = () => {
            setData(null);
            window.localStorage.removeItem("last_stream");
        };
        const seek        = (seconds: number)  => socket.emit(SOCKET_ACTIONS.SEEK, seconds);
        const leaveStream = (id: string)       => socket.emit(SOCKET_ACTIONS.LEAVE, id);
        const joinStream  = (id: string)       => {
            window.localStorage.setItem("last_stream", id);
            socket.emit(SOCKET_ACTIONS.JOIN, id);
        };
        const startStream = (videoId: string)       => {
            socket.emit(SOCKET_ACTIONS.PLAY_NOW, videoId);
            window.localStorage.removeItem("last_stream");
        };

        return {
            onRoomJoin,
            onRoomLeave,
            seek,
            joinStream,
            startStream,
            leaveStream,
            nowPlaying : data
        };
    }, [data]);

    useEffect(() => {
        socket.on(SOCKET_ACTIONS.PLAY_NOW, context.onRoomJoin);
        socket.emit(SOCKET_ACTIONS.CHECK, window.localStorage.getItem("last_stream"));
        return () => socket.off(SOCKET_ACTIONS.PLAY_NOW, context.onRoomJoin);
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