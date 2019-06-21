import * as React from "react";

import WatchIcon from "../icons/Watch";
import PlayIcon  from "../icons/Play";

import { useSocket } from "../contexts/socket";
import { usePlayer } from "../contexts/player";

import { secondsToTime } from "../helpers";

import { SOCKET_ACTIONS } from "../../constants";

const Video: React.FunctionComponent<VideoProps> = (props) => {
    const { id, title, thumbnail, duration } = props;

    const socket         = useSocket();
    const { onRoomJoin } = usePlayer();

    const onPlayNow = () => {
        socket.emit(SOCKET_ACTIONS.PLAY_NOW, id, (data: PlayerData) => { onRoomJoin(data); });
    };

    return (
        <div className="video">
            <div className="video-thumbnail-outer">
                <img className="video-thumbnail" src={ thumbnail } />
                <span className="video-duration">{ secondsToTime(duration) }</span>
                <div className="video-floating-actions">
                    <WatchIcon />
                    <PlayIcon onClick={ onPlayNow } />
                    <div />
                </div>
            </div>
            <div className="video-title">{ title }</div>
        </div>
    )
};





interface VideoProps {
    id        : string,
    title     : string,
    thumbnail : string,
    duration  : number
}

export default Video;