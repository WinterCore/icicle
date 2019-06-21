import * as React from "react";

import Previous from "../icons/Previous";
import Play     from "../icons/Play";
import Pause    from "../icons/Pause";
import Next     from "../icons/Next";
import Volume   from "../icons/Volume";

import Trackbar from "../components/Trackbar";

import { usePlayer } from "../contexts/player";
import { useUser }   from "../contexts/user";

import { secondsToTime } from "../helpers";

const Placeholder: React.FunctionComponent = () => {
    return (
        <div className="player-outer">
            <div className="player-info">
                <div className="player-title">Nothing is currently playing</div>
                <div className="player-by">Join a room to start listening</div>
            </div>
            <div className="player-controls">
                <div className="play-pause"><Play /></div>
            </div>
            <div className="player-trackbar">
                <Trackbar seekable={ false } onSeek={ () => null } percentage={ 0 } />
            </div>
            <div className="player-duration">
                
            </div>
        </div>
    );
};

const Player: React.FunctionComponent = (props) => {
    const { nowPlaying, onSeek, onPause, onPlay } = usePlayer();
    const { user } = useUser();
    const playerRef = React.useRef(null);
    const [percentage, setPercentage] = React.useState(nowPlaying.startAt / nowPlaying.duration * 100);

    React.useEffect(() => {
        let progressInterval: NodeJS.Timeout;
        if (playerRef.current) {
            playerRef.current.onloadedmetadata = () => {
                progressInterval = setInterval(() => {
                    onSeek(playerRef.current.currentTime / playerRef.current.duration * 100);
                }, 1000);
            };
        }
        return () => clearInterval(progressInterval);
    }, [nowPlaying ? nowPlaying.startAt : 0]);


    React.useEffect(() => {
        if (playerRef.current) {
            if (Math.abs(nowPlaying.startAt - (playerRef.current)) > 5) {

            }
        }
    }, [nowPlaying ? nowPlaying.startAt : 0]);
    
    if (!nowPlaying) return <Placeholder />;
    return (
        <div className="player-outer">
            <div className="player-info">
                <div className="player-title">{ nowPlaying.title }</div>
                <div className="player-by">By { nowPlaying.by.name }</div>
            </div>
            <div className="player-controls">
                <Previous />
                <div className="play-pause">
                    {
                        nowPlaying.isPaused
                            ? <Play onClick={ onPlay } />
                            : <Pause onClick={ onPause } />
                    }
                </div>
                <Next />
            </div>
            <div className="player-trackbar">
                <Trackbar percentage={ percentage } onSeek={ onSeek } seekable={ nowPlaying.by._id === user._id } />
            </div>
            <div className="player-duration">
                { secondsToTime(nowPlaying.duration) }
            </div>
            <div className="player-volume">
                <Volume />
            </div>
            {
                <audio ref={ playerRef } autoPlay>
                    <source src={ nowPlaying.url } type="audio/ogg" />
                </audio>
            }
        </div>
    );
};


export default Player;