import * as React    from "react";

import { useSocket }       from "./socket";
import { useUser }         from "./user";
import { useNotification } from "./notification";

import { SOCKET_ACTIONS } from "../../constants";

const { useContext, createContext, useState, useMemo, useEffect } = React;

const PlayerContext = createContext(null);

type RoomData = {
    _id  : string;
    name : string;
}

interface PlayerProvider {
    onRoomJoin  (data: PlayerData) : void;
    seek        (seconds: number)  : void;
    startStream (id: string)       : void;
    leaveStream ()                 : void;
    joinStream  (id: string)       : void;
    skip        ()                 : void;
    
    roomData   : RoomData;
    nowPlaying : PlayerData;
}

const PlayerProvider: React.FunctionComponent = (props): React.ReactElement => {
    const [data, setData]         = useState<PlayerData | null>(null);
    const [roomData, setRoomData] = useState<RoomData | null>(() => JSON.parse(window.localStorage.getItem("last_stream")));
    const { socket }              = useSocket();
    const { addNotification }     = useNotification();
    const onRoomJoin  = (data: PlayerData) => {
        setRoomData(roomData => data ? data.by : roomData);
        if (data) window.localStorage.setItem("last_stream", JSON.stringify(data.by));
        setData(data ? { ...data } : null);
    };
    const leaveStream = () => {
        socket.emit(SOCKET_ACTIONS.LEAVE);
        setData(null);
        setRoomData(null);
        window.localStorage.removeItem("last_stream");
    };
    const seek              = (seconds: number)  => socket.emit(SOCKET_ACTIONS.SEEK, seconds);
    const joinStream        = (id: string)       => socket.emit(SOCKET_ACTIONS.JOIN, id);
    const skip              = ()                 => socket.emit(SOCKET_ACTIONS.SKIP);
    const handleSocketJoin  = ()                 => setData(data => ({ ...data, liveListeners : data.liveListeners + 1 }));
    const handleSocketLeave = ()                 => setData(data => ({ ...data, liveListeners : data.liveListeners - 1 }));
    const handleError       = (message: string)  => addNotification({ id :`${Date.now()}`, message, type : "error", time : 5000 });

    const startStream = (videoId: string) => {
        socket.emit(SOCKET_ACTIONS.PLAY_NOW, videoId);
        window.localStorage.removeItem("last_stream");
    };

    const context = {
        onRoomJoin,
        leaveStream,
        seek,
        joinStream,
        startStream,
        roomData,
        skip,
        nowPlaying : data
    };


    useEffect(() => {
        const data = JSON.parse(window.localStorage.getItem("last_stream")) || {};
        socket.on(SOCKET_ACTIONS.PLAY_NOW, context.onRoomJoin);
        socket.on(SOCKET_ACTIONS.SOCKET_JOINED, handleSocketJoin);
        socket.on(SOCKET_ACTIONS.SOCKET_JOINED, () => console.log("Joined"));
        socket.on(SOCKET_ACTIONS.SOCKET_LEFT, handleSocketLeave);
        socket.on(SOCKET_ACTIONS.ERROR, handleError);
        socket.emit(SOCKET_ACTIONS.CHECK, data._id);
        return () => socket.off(SOCKET_ACTIONS.PLAY_NOW, context.onRoomJoin);
    }, [
        socket
    ]);

    const onReconnect = () => {
        const data = JSON.parse(window.localStorage.getItem("last_stream")) || {};
        socket.emit(SOCKET_ACTIONS.CHECK, data._id);
    };

    useEffect(() => {
        socket.on("reconnect", onReconnect);
        return () => socket.off("reconnect", onReconnect);
    });



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