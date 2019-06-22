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
                <Trackbar seekable={ false } onSeek={ () => null } percentage={ 0 } />
            </div>
            <div className="player-duration">
                
            </div>
        </div>
    );
};


const ActualPlayer: React.FunctionComponent = () => {
    const { nowPlaying, onSeek, onPause, onPlay } = usePlayer();
    const { user } = useUser();
    const playerRef = React.useRef<HTMLAudioElement>(null);
    const [percentage, setPercentage] = React.useState(nowPlaying.startAt / nowPlaying.duration * 100);
    const [isPaused, setIsPaused] = React.useState(nowPlaying.isPaused);
    const [volume, setVolume] = React.useState(playerRef.current ? playerRef.current.volume : 0);
    const isOwner = user ? nowPlaying.by._id === user._id : null;

    const handleSeek = (percentage: number) => {
        const currentTime = nowPlaying.duration * percentage;
        if (playerRef.current) {
            playerRef.current.currentTime = currentTime;
            setPercentage(percentage * 100);
        }
    };

    const handlePlayPause = () => {
        if (isPaused) {
            playerRef.current.play();
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
        let progressInterval: NodeJS.Timeout;
        if (playerRef.current) {
            playerRef.current.onloadedmetadata = () => {
                progressInterval = setInterval(() => {
                    setPercentage(playerRef.current.currentTime / playerRef.current.duration * 100);
                }, 1000);
                // TODO: Virtually progress the bar if the player is paused to give the illusion that the player is only paused for the current user
            };
        }
        return () => clearInterval(progressInterval);
    }, [nowPlaying.startAt]);

    React.useEffect(() => {
        if (playerRef.current) {
            playerRef.current.src = nowPlaying.url;
            playerRef.current.currentTime = nowPlaying.startAt;
            playerRef.current.play()
            .then(() => {
                setVolume(playerRef.current.volume);
            }).catch(() => {
                setIsPaused(true);
            });
        }
    }, [nowPlaying.startAt, nowPlaying.url]);
    
    // React.useEffect(() => {
    //     if (playerRef.current) {

    //     }
    // }, [nowPlaying.id]);

    return (
        <div className="player-outer">
            <div className="player-info">
                <div className="player-title">{ nowPlaying.title }</div>
                <div className="player-by">By { nowPlaying.by.name }</div>
            </div>
            <div className="player-controls">
                { isOwner && <Previous /> } 
                <div className="play-pause" onClick={ handlePlayPause }>
                    {
                        isPaused
                            ? <Play />
                            : <Pause />
                    }
                </div>
                { isOwner && <Next /> } 
            </div>
            <div className="player-trackbar">
                <Trackbar percentage={ percentage } onSeek={ handleSeek } seekable={ isOwner } />
            </div>
            <div className="player-duration">
                { secondsToTime(nowPlaying.duration) }
            </div>
            <div className="player-volume">
                <VolumeRocker volume={ volume } onVolumeChange={ onVolumeChange } />
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