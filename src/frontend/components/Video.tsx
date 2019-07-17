import * as React from "react";

import WatchIcon          from "../icons/Watch";
import PlayIcon           from "../icons/Play";
import Loader             from "../icons/Loader";
import AddToPlaylistIcon  from "../icons/AddToPlaylist";

import { usePlayer }       from "../contexts/player";
import { useUser }         from "../contexts/user";
import { useNotification } from "../contexts/notification";
import { usePlaylists }    from "../contexts/playlists";

import api, { ADD_TO_QUEUE } from "../api";

const Video: React.FunctionComponent<VideoProps> = (props) => {
    const { id, title, thumbnail, duration }            = props;
    const [isAddToQueueLoading, setIsAddToQueueLoading] = React.useState(false);
    const [isAddToQueueDone, setIsAddToQueueDone]       = React.useState(false);
    const [isPlayNowLoading, setIsPlayNowLoading]       = React.useState(false);
    const { startStream, nowPlaying }                   = usePlayer();
    const { addNotification }                           = useNotification();
    const { openModal }                                 = usePlaylists();
    const { user }                                      = useUser();

    const onPlayNow = () => {
        if (nowPlaying ? nowPlaying.title !== title : true) {
            setIsPlayNowLoading(true);
            startStream(id);
        }
    };
    const addToQueue = async (e) => {
        e.preventDefault();
        setIsAddToQueueLoading(true);
        try {
            if (!nowPlaying || nowPlaying.by._id !== user._id) { // Start a stream if the user is not already in one or if the current stream is not the user's
                startStream(id);
                addNotification({
                    id :`${Date.now()}`,
                    message : "Your queue is empty, the video will be played immediately.",
                    type : "success",
                    time : 5000
                });
            } else {
                await api({ ...ADD_TO_QUEUE(), data : { id } });
                addNotification({
                    id :`${Date.now()}`,
                    message : `${title} has been added to the queue.`,
                    type : "success",
                    time : 5000
                });
            }
            setIsAddToQueueDone(true);
        } catch(e) {
            if (e.response && e.response.status === 422) {
                addNotification({
                    id :`${Date.now()}`,
                    message : e.response.data.errors,
                    type : "error",
                    time : 5000
                });
            }
            setIsAddToQueueDone(true);
        }
    };

    React.useEffect(() => {
        if (nowPlaying && title === nowPlaying.title) setIsPlayNowLoading(false);
    }, [nowPlaying && nowPlaying.title]);

    return (
        <div className="video">
            <div className="video-thumbnail-outer">
                <img className="video-thumbnail" src={ thumbnail } />
                {/* <span className="video-duration">{ secondsToTime(duration) }</span> */}
                <div className="video-floating-actions">
                    { user ? (isAddToQueueDone ? <div /> : (!isAddToQueueLoading ? <WatchIcon onClick={ addToQueue } /> : <Loader />)) : <div /> }
                    { isPlayNowLoading ? <Loader /> : <PlayIcon onClick={ onPlayNow } /> }
                    { user ? <AddToPlaylistIcon onClick={ () => openModal(id) } /> : <div /> }
                </div>
            </div>
            <div className="video-title" dangerouslySetInnerHTML={{ __html : title }} />
        </div>
    );
};





interface VideoProps {
    id        : string;
    title     : string;
    thumbnail : string;
    duration ?: number;
}

export default Video;