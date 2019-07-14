import * as React from "react";

import CrossIcon  from "../icons/Cross";
import PlayIcon   from "../icons/Play";
import LoaderIcon from "../icons/Loader";
import WatchIcon  from "../icons/Watch";

import { secondsToTime } from "../helpers";

import { usePlayer }       from "../contexts/player";
import { useNotification } from "../contexts/notification";
import { useUser } from "../contexts/user";

import TextRoller from "./TextRoller";

import api, { DELETE_PLAYLIST_ITEM, ADD_TO_QUEUE } from "../api";


const PlaylistItem: React.FunctionComponent<PlaylistItemProps> = (props) => {
    const { thumbnail, title, duration, videoId, playlistId, onDelete } = props;

    const [isLoading, setIsLoading]                     = React.useState<boolean>(false);
    const [isAddToQueueLoading, setIsAddToQueueLoading] = React.useState<boolean>(false);

    const { startStream, nowPlaying } = usePlayer();
    const { user }                    = useUser();
    const { addNotification }         = useNotification();

    const deletePlaylistItem = () => {
        setIsLoading(true);
        api({
            ...DELETE_PLAYLIST_ITEM(playlistId, videoId)
        }).then(() => {
            setIsLoading(false);
            onDelete(videoId);
            addNotification({
                id      : `${Date.now()}`,
                message : `${title} was removed successfully`,
                type    : "success"     
            });
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
    };

    const addToQueue = async (e) => {
        e.preventDefault();
        setIsAddToQueueLoading(true);
        try {
            if (!nowPlaying || nowPlaying.by._id !== user._id) { // Start a stream if the user is not already in one or if the current stream is not the user's
                startStream(videoId);
                addNotification({
                    id :`${Date.now()}`,
                    message : "Your queue is empty, the video will play immediately.",
                    type : "success",
                    time : 5000
                });
            } else {
                await api({ ...ADD_TO_QUEUE(), data : { id : videoId } });
                addNotification({
                    id :`${Date.now()}`,
                    message : `${title} has been added to the queue.`,
                    type : "success",
                    time : 5000
                });
            }
            setIsAddToQueueLoading(false);
        } catch(e) {
            console.log(e);
            
            setIsAddToQueueLoading(false);
            if (e.response && e.response.status === 422) {
                addNotification({
                    id :`${Date.now()}`,
                    message : e.response.data.errors,
                    type : "error",
                    time : 5000
                });
            }
        }
    };

    const playPlaylistItem = () => {
        startStream(videoId);
    };

    return (
        <div className="song-outer">
            <div className="song">
                <div className="song-image" style={{ backgroundImage : `url(${thumbnail})` }}></div>
                <div className="song-middle-outer">
                    <div className="song-info">
                        <div className="song-name">
                            <TextRoller>
                                { title }
                            </TextRoller>
                        </div>
                    </div>
                </div>
                <div className="song-duration">
                    { secondsToTime(duration) }
                </div>
                {
                    <div className="song-actions">
                        { isAddToQueueLoading ? <LoaderIcon /> : <WatchIcon onClick={ addToQueue } /> }
                        <PlayIcon onClick={ playPlaylistItem } />
                        { isLoading ? <LoaderIcon /> : <CrossIcon onClick={ deletePlaylistItem } /> }
                    </div>
                }
            </div>
        </div>
    );
};

interface PlaylistItemProps extends Entities.Song {
    playlistId : string;
    onDelete   : {(videoId: string): any};
}

export default PlaylistItem;