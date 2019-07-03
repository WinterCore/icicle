import * as React from "react";

import Previous from "../icons/Previous";
import Play     from "../icons/Play";
import Pause    from "../icons/Pause";
import Next     from "../icons/Next";

import Trackbar     from "../components/Trackbar";
import VolumeRocker from "../components/VolumeRocker";

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
                <Trackbar seekable={ false } onSeek={ () => null } percentage={ 0 } disabled={ true } />
            </div>
            <div className="player-duration">
                
            </div>
        </div>
    );
};


const ActualPlayer: React.FunctionComponent = () => {
    const { nowPlaying, seek, skip }        = usePlayer();
    const { user }                          = useUser();
    const playerRef                         = React.useRef<HTMLAudioElement>(null);
    const [secondsPlayed, setSecondsPlayed] = React.useState(nowPlaying.startAt);
    const [isPaused, setIsPaused]           = React.useState(true);
    const [volume, setVolume]               = React.useState(playerRef.current ? playerRef.current.volume : 0);
    const isOwner                           = user ? nowPlaying.by._id === user._id : null;
    const handleSeek = (percentage: number) => {
        const currentTime = nowPlaying.duration * percentage;
        seek(currentTime);
        playerRef.current.currentTime = currentTime;
        setSecondsPlayed(currentTime);
    };

    const handlePlayPause = () => {
        if (isPaused) {
            playerRef.current.play();
            playerRef.current.currentTime = secondsPlayed;
            setVolume(playerRef.current.volume);
            setIsPaused(false);
        } else {
            playerRef.current.pause();
            setIsPaused(true);
        }
    };

    const onVolumeChange = (percentage: number) => {
        setVolume(percentage);
        playerRef.current.volume = percentage;
    };

    React.useEffect(() => {
        let progressInterval: NodeJS.Timeout = setInterval(() => setSecondsPlayed(secondsPlayed => secondsPlayed + 1), 1000);
        return () => clearInterval(progressInterval);
    }, []);
    React.useEffect(() => {
        if (playerRef.current) {
            playerRef.current.src = nowPlaying.url;
            playerRef.current.currentTime = nowPlaying.startAt;
            setSecondsPlayed(nowPlaying.startAt);
            playerRef.current.play()
                .then(() => {
                    setIsPaused(false);
                    setVolume(playerRef.current.volume);
                }).catch(() => {
                    setIsPaused(true);
                });
        }
    }, [nowPlaying.startAt, nowPlaying.url]);

    React.useEffect(() => {
        playerRef.current.volume = 0.3;
        setVolume(0.3); 
    }, []);

    return (
        <div className="player-outer">
            <div className="player-info">
                <div className="player-title" title={ nowPlaying.title }>{ nowPlaying.title }</div>
                <div className="player-by">Listening to { nowPlaying.by.name }</div>
            </div>
            <div className="player-controls">
                <div className="play-pause" onClick={ handlePlayPause }>
                    {
                        isPaused
                            ? <Play />
                            : <Pause />
                    }
                </div>
                { isOwner && <Next onClick={ skip } /> } 
            </div>
            <div className="player-trackbar">
                <Trackbar percentage={ (secondsPlayed / nowPlaying.duration) * 100 } onSeek={ handleSeek } seekable={ isOwner } />
            </div>
            <div className="player-far-right">
                <div className="player-duration">
                    { secondsToTime(nowPlaying.duration) }
                </div>
                <div className="player-volume">
                    <VolumeRocker volume={ volume } onVolumeChange={ onVolumeChange } />
                </div>
            </div>
            { <audio ref={ playerRef } /> }
        </div>
    );
};

const Player: React.FunctionComponent = (props) => {
    const { nowPlaying } = usePlayer();
    if (!nowPlaying) return <Placeholder />;
    else return <ActualPlayer />;
};


export default Player;