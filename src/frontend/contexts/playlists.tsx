import * as React    from "react";

import api, { GET_SONG_PLAYLISTS, GET_PLAYLISTS } from "../api";

import { useNotification } from "./notification";
import { useUser } from "./user";

const { useContext, createContext, useState, useEffect, useCallback } = React;

const PlaylistContext = createContext(null);

type Playlist = {
    _id  : string;
    name : string;
};

type PlaylistContext = {
    playlists              : Playlist[];
    isLoading              : boolean;
    isModalOpen            : boolean;
    songPlaylists          : string[];
    videoId                : string;
    isLoadingSongPlaylists : boolean;
    
    closeModal       ()                : void;
    openModal        (videoId: string) : void;
    setSongPlaylists (fn : Function)   : void;
    setPlaylists     (fn : Function)   : void;
};

const PlaylistsProvider: React.FunctionComponent = (props): React.ReactElement => {
    const [playlists, setPlaylists]                           = useState<Playlist[]>([]);
    const [isLoading, setIsLoading]                           = useState<boolean>(true);
    const [isLoadingSongPlaylists, setIsLoadingSongPlaylists] = useState<Boolean>(true);
    const [songPlaylists, setSongPlaylists]                   = useState<string[]>([]);
    const [videoId, setVideoId]                               = useState<string>(null);
    const [isModalOpen, setIsModalOpen]                       = useState<boolean>(false);
    const { addNotification }                                 = useNotification();
    const { user }                                            = useUser();

    const openModal = useCallback((videoId: string) => {
        setIsModalOpen(true);
        setIsLoadingSongPlaylists(true);
        setVideoId(videoId);
        api(GET_SONG_PLAYLISTS(videoId))
            .then(({ data : { data } }) => {
                setSongPlaylists(data);
                setIsLoadingSongPlaylists(false);
            }).catch((err) => {
                console.log(err);
                setIsLoadingSongPlaylists(false);
            });
    }, []);

    const closeModal = useCallback(() => {
        setIsModalOpen(false);
        setSongPlaylists([]);
        setVideoId(null)
    }, []);

    useEffect(() => {
        if (user) {
            api(GET_PLAYLISTS())
                .then(({ data : { data } }) => {
                    setPlaylists(data);
                    setIsLoading(false);
                }).catch((err) => {
                    console.log(err);
                    setIsLoading(false);
                    addNotification({ message : "Something happened while trying to fetch your playlists", type : "error" });
                });
        }
    }, [!!user]);


    return <PlaylistContext.Provider value={{ playlists, isLoadingSongPlaylists, setPlaylists, isLoading, isModalOpen, openModal, songPlaylists, closeModal, setSongPlaylists, videoId }} { ...props } />;
}

function usePlaylists() {
    const context = useContext<PlaylistContext>(PlaylistContext);
    if (!context) {
        throw new Error("usePlaylists must be used within a component that's rendered within the PlaylistsProvider");
    }
    return context;
}

export {
    PlaylistsProvider,
    usePlaylists
};