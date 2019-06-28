import * as React from "react";

import WatchIcon from "../icons/Watch";
import PlayIcon  from "../icons/Play";
import Loader    from "../icons/Loader";

import { usePlayer } from "../contexts/player";

import { secondsToTime } from "../helpers";

import api, { ADD_TO_QUEUE } from "../api";

const Video: React.FunctionComponent<VideoProps> = (props) => {
    const { id, title, thumbnail, duration } = props;
    const { startStream, nowPlaying } = usePlayer();
    const [isLoading, setIsLoading] = React.useState(false);
    const [isDone, setIsDone] = React.useState(false);

    const onPlayNow = () => {
        if (nowPlaying ? nowPlaying.title !== title : true) {
            startStream(id);
        }
    };
    const addToQueue = React.useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        await api({ ...ADD_TO_QUEUE(), data : { id } });
        alert("Added to the queue successfully");
        setIsDone(true);
    }, []);

    return (
        <div className="video">
            <div className="video-thumbnail-outer">
                <img className="video-thumbnail" src={ thumbnail } />
                <span className="video-duration">{ secondsToTime(duration) }</span>
                <div className="video-floating-actions">
                    { isDone ? <div /> : (!isLoading ? <WatchIcon onClick={ addToQueue } /> : <Loader />) }
                    <PlayIcon onClick={ onPlayNow } />
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