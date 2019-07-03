import * as React from "react";

import WatchIcon from "../icons/Watch";
import PlayIcon  from "../icons/Play";
import Loader    from "../icons/Loader";

import { usePlayer } from "../contexts/player";
import { useNotification } from "../contexts/notification";

import { secondsToTime } from "../helpers";

import api, { ADD_TO_QUEUE } from "../api";

const Video: React.FunctionComponent<VideoProps> = (props) => {
    const { id, title, thumbnail, duration }            = props;
    const { startStream, nowPlaying }                   = usePlayer();
    const [isAddToQueueLoading, setIsAddToQueueLoading] = React.useState(false);
    const [isAddToQueueDone, setIsAddToQueueDone]       = React.useState(false);
    const [isPlayNowLoading, setIsPlayNowLoading]       = React.useState(false);
    const { addNotification }                           = useNotification();

    const onPlayNow = () => {
        if (nowPlaying ? nowPlaying.title !== title : true) {
            setIsPlayNowLoading(true);
            startStream(id);
        }
    };
    const addToQueue = React.useCallback(async (e) => {
        e.preventDefault();
        setIsAddToQueueLoading(true);
        try {
            await api({ ...ADD_TO_QUEUE(), data : { id } });
            addNotification({
                id :`${Date.now()}`,
                message : `${title} has been added to the queue.`,
                type : "success",
                time : 5000
            });
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
    }, []);

    React.useEffect(() => {
        if (nowPlaying && title === nowPlaying.title) setIsPlayNowLoading(false);
    }, [nowPlaying && nowPlaying.title]);

    return (
        <div className="video">
            <div className="video-thumbnail-outer">
                <img className="video-thumbnail" src={ thumbnail } />
                <span className="video-duration">{ secondsToTime(duration) }</span>
                <div className="video-floating-actions">
                    { isAddToQueueDone ? <div /> : (!isAddToQueueLoading ? <WatchIcon onClick={ addToQueue } /> : <Loader />) }
                    { isPlayNowLoading ? <Loader /> : <PlayIcon onClick={ onPlayNow } /> }
                    <div />
                </div>
            </div>
            <div className="video-title" dangerouslySetInnerHTML={{ __html : title }} />
        </div>
    )
};





interface VideoProps {
    id        : string;
    title     : string;
    thumbnail : string;
    duration  : number;
}

export default Video;