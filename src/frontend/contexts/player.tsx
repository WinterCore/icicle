import * as React    from "react";

const { useContext, createContext, useState, useMemo } = React;

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

    const context = useMemo<PlayerProvider>(() => {
        const onRoomJoin  = (data: PlayerData) => { setData({ ...data }); };
        const onRoomLeave = ()                 => { setData(null); };
        const onSeek      = (seconds: number)  => { setData({ ...data, startAt : seconds }); };
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