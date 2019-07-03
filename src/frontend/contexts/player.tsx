import * as React    from "react";

import { useSocket } from "./socket";
import { useUser } from "./user";

import { SOCKET_ACTIONS } from "../../constants";

const { useContext, createContext, useState, useMemo, useEffect } = React;

const PlayerContext = createContext(null);

type RoomData = {
    _id  : string;
    name : string;
}

interface PlayerProvider {
    onRoomJoin  (data: PlayerData) : void;
    leaveRoom()                    : void;
    seek        (seconds: number)  : void;
    startStream (id: string)       : void;
    leaveStream (id: string)       : void;
    joinStream  (id: string)       : void;
    skip        ()                 : void;
    roomData   : RoomData;
    nowPlaying : PlayerData;
}

const PlayerProvider: React.FunctionComponent = (props): React.ReactElement => {
    const [data, setData]         = useState<PlayerData | null>(null);
    const [roomData, setRoomData] = useState<RoomData | null>(null);
    const { socket }   = useSocket();
    const { user }                = useUser();

    const onRoomJoin  = (data: PlayerData) => {
        const tempRoomData = data ? data.by : null;
        setRoomData(tempRoomData);
        window.localStorage.setItem("last_stream", JSON.stringify(tempRoomData));
        setData(data ? { ...data } : null);
    };
    const leaveRoom = () => {
        setData(null);
        setRoomData(null);
        window.localStorage.removeItem("last_stream");
    };
    const seek        = (seconds: number)  => socket.emit(SOCKET_ACTIONS.SEEK, seconds);
    const leaveStream = (id: string)       => socket.emit(SOCKET_ACTIONS.LEAVE, id);
    const joinStream  = (id: string)       => socket.emit(SOCKET_ACTIONS.JOIN, id);
    const skip        = ()                 => socket.emit(SOCKET_ACTIONS.SKIP);


    const startStream = (videoId: string) => {
        socket.emit(SOCKET_ACTIONS.PLAY_NOW, videoId);
        window.localStorage.removeItem("last_stream");
    };

    useEffect(() => {
        const data = JSON.parse(window.localStorage.getItem("last_stream")) || {};
        socket.on(SOCKET_ACTIONS.PLAY_NOW, context.onRoomJoin);
        socket.emit(SOCKET_ACTIONS.CHECK, data._id);
        return () => socket.off(SOCKET_ACTIONS.PLAY_NOW, context.onRoomJoin);
    }, [
        user, // Request nowplaying data after user login/logout
    ]);

    const onReconnect = () => {
        const data = JSON.parse(window.localStorage.getItem("last_stream")) || {};
        socket.emit(SOCKET_ACTIONS.CHECK, data._id);
    };

    useEffect(() => {
        socket.on("reconnect", onReconnect);
        return () => socket.off("reconnect", onReconnect);
    });


    const context = {
        onRoomJoin,
        leaveRoom,
        seek,
        joinStream,
        startStream,
        leaveStream,
        roomData,
        skip,
        nowPlaying : data,
    };

    return <PlayerContext.Provider value={ context } { ...props } />;
};

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