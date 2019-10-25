import * as React    from "react";

import { useSocket }       from "./socket";
import { useUser }         from "./user";
import { useNotification } from "./notification";

import { SOCKET_ACTIONS } from "../../constants";

const { useContext, createContext, useState, useEffect } = React;

const PlayerContext = createContext<PlayerProvider | null>(null);

interface PlayerProvider {
    onRoomJoin      (data: PlayerData) : void;
    seek            (seconds: number)  : void;
    startStream     (id: string)       : void;
    leaveStream     ()                 : void;
    joinStream      (id: string)       : void;
    terminateStream ()                 : void;
    skip            ()                 : void;
    play            ()                 : void;
    
    roomData   : PlayerDataUser | null;
    nowPlaying : PlayerData | null;
}

const PlayerProvider: React.FunctionComponent = (props): React.ReactElement => {
    const [data, setData]         = useState<PlayerData | null>(null);
    const [roomData, setRoomData] = useState<PlayerDataUser | null>(() => {
        const val = window.localStorage.getItem("last_stream");
        return val ? JSON.parse(val) : null;
    });
    const { isLoading }       = useSocket();
    const { addNotification } = useNotification();

    const socket = window.socket;

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

    const handleDeadRoomJoin = (data: PlayerDataUser) => {
        setRoomData(data);
        window.localStorage.setItem("last_stream", JSON.stringify(data));
    };

    const {
        seek,
        joinStream,
        skip,
        handleError,
        terminateStream,
        play,
        updateListeners
    } = React.useMemo(() => ({
        seek              : (seconds: number)       => socket.emit(SOCKET_ACTIONS.SEEK, seconds),
        joinStream        : (id: string)            => socket.emit(SOCKET_ACTIONS.JOIN, id),
        skip              : ()                      => socket.emit(SOCKET_ACTIONS.SKIP),
        handleError       : (message: string)       => addNotification({ message, type : "error" }),
        terminateStream   : ()                      => socket.emit(SOCKET_ACTIONS.END_STREAM),
        play              : ()                      => socket.emit(SOCKET_ACTIONS.PLAY),
        updateListeners   : (liveListeners: number) => setRoomData(roomData => roomData ? ({ ...roomData, liveListeners }) : roomData),
    }), []);

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
        terminateStream,
        play,
        nowPlaying : data
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            socket.emit(SOCKET_ACTIONS.PROBE_LISTENERS);
        }, 15000);

        return () => { clearInterval(intervalId); };
    }, [roomData && roomData._id]);


    useEffect(() => {
        socket.on(SOCKET_ACTIONS.PLAY_NOW, context.onRoomJoin);
        socket.on(SOCKET_ACTIONS.DEAD_JOIN, handleDeadRoomJoin);
        socket.on(SOCKET_ACTIONS.ERROR, handleError);
        socket.on(SOCKET_ACTIONS.UPDATE_LISTENERS, updateListeners);
        socket.on(SOCKET_ACTIONS.END_STREAM, () => {
            setData(null);
            setRoomData(null);
            window.localStorage.removeItem("last_stream");
        });
        return () => { socket.off(SOCKET_ACTIONS.PLAY_NOW, context.onRoomJoin); };
    }, []);

    useEffect(() => {
        if (!isLoading) {
            socket.emit(SOCKET_ACTIONS.CHECK, roomData ? roomData._id : null);
        }
    }, [isLoading]);


    return <PlayerContext.Provider value={ context } { ...props } />;
};

function usePlayer(): PlayerProvider {
    const context = useContext(PlayerContext);
    if (!context) {
        throw new Error("usePlayer must be used within a component that's rendered within the PlayerProvider");
    }
    return context;
}

export {
    PlayerProvider,
    usePlayer
};