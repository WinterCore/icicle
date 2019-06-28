import * as React from "react";

import WatchIcon from "../icons/Watch";
import PlayIcon  from "../icons/Play";
import Loader    from "../icons/Loader";

import { usePlayer } from "../contexts/player";

import { secondsToTime } from "../helpers";

import api, { ADD_TO_QUEUE } from "../api";

const Video: React.FunctionComponent<VideoProps> = (props) => {
    const { id, title, thumbnail, duration }            = props;
    const { startStream, nowPlaying }                   = usePlayer();
    const [isAddToQueueLoading, setIsAddToQueueLoading] = React.useState(false);
    const [isAddToQueueDone, setIsAddToQueueDone]       = React.useState(false);
    const [isPlayNowLoading, setIsPlayNowLoading]       = React.useState(false);

    const onPlayNow = () => {
        if (nowPlaying ? nowPlaying.title !== title : true) {
            setIsPlayNowLoading(true);
            startStream(id);
        }
    };
    const addToQueue = React.useCallback(async (e) => {
        e.preventDefault();
        setIsAddToQueueLoading(true);
        await api({ ...ADD_TO_QUEUE(), data : { id } });
        alert("Added to the queue successfully");
        setIsAddToQueueDone(true);
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