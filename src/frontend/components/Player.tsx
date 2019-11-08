import * as React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import Play     from "../icons/Play";
import Pause    from "../icons/Pause";
import Next     from "../icons/Next";

import VolumeRocker from "./VolumeRocker";
import TextRoller   from "./TextRoller";
import TrackbarV2   from "./TrackbarV2";

import { usePlayer }    from "../contexts/player";
import { useUser }      from "../contexts/user";
import { usePlaylists } from "../contexts/playlists";

import { secondsToTime, SHORTCUTS } from "../helpers";

const Placeholder: React.FunctionComponent = () => {
    return (
        <div className="player-outer">
            <div className="player-info">
                <div className="player-title">
                    <TextRoller>
                        Nothing is currently playing
                    </TextRoller>
                </div>
                <div className="player-by">
                    <TextRoller>
                        Join a room to start listening
                    </TextRoller>
                </div>
            </div>
            <div className="player-controls">
                <div className="play-pause"><Play /></div>
            </div>
            <div className="player-trackbar">
                
                <TrackbarV2 uid={ 0 } percentage={ 0 } onSeek={ () => null } seekable={ false } />
            </div>
            <div className="player-duration">
                
            </div>
        </div>
    );
};


const ActualPlayer: React.FunctionComponent = () => {
    const player                                    = usePlayer();
    const { seek, skip }                            = player;
    const nowPlaying                                = player.nowPlaying as PlayerData;
    const { user }                                  = useUser();
    const { openModal }                             = usePlaylists();
    const playerRef                                 = React.useRef<HTMLAudioElement>(null);
    const [secondsPlayed, setSecondsPlayed]         = React.useState(nowPlaying.startAt);
    const [isPaused, setIsPaused]                   = React.useState<boolean>(true);
    const [isPausedOnPurpose, setIsPausedOnPurpose] = React.useState<boolean>(false);
    const isOwner                                   = user ? nowPlaying.by._id === user._id : false;
    const handleSeek                                = (percentage: number) => {
        const currentTime = nowPlaying.duration * percentage;
        seek(currentTime);
        playerRef.current!.currentTime = currentTime;
        setSecondsPlayed(currentTime);
    };

    const handlePlayPause = () => {
        if (isPaused) {
            playerRef.current!.play();
            playerRef.current!.currentTime = secondsPlayed;
            setIsPaused(false);
            setIsPausedOnPurpose(false);
        } else {
            playerRef.current!.pause();
            setIsPaused(true);
            setIsPausedOnPurpose(true);
        }
    };

    React.useEffect(() => {
        // @ts-ignore
        if (navigator.mediaSession) {
            // @ts-ignore
            navigator.mediaSession.setActionHandler("play", handlePlayPause);
            // @ts-ignore
            navigator.mediaSession.setActionHandler("pause", handlePlayPause);
            // @ts-ignore
            navigator.mediaSession.setActionHandler("nexttrack", skip);
        }
    });

    const onVolumeChange = (percentage: number) => {
        playerRef.current!.volume = percentage;
        window.localStorage.setItem("volume", `${percentage}`);
    };

    React.useEffect(() => {
        let progressInterval: number = window.setInterval(() => setSecondsPlayed(secondsPlayed => secondsPlayed + 1), 1000);
        return () => clearInterval(progressInterval);
    }, []);
    React.useEffect(() => {
        if (playerRef.current) {
            // @ts-ignore
            if (navigator.mediaSession) {
                // @ts-ignore
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: nowPlaying.title,
                    artist: nowPlaying.by.name,
                    artwork: [{ src: nowPlaying.thumbnail, sizes: "320x180", type: "image/jpeg" }]
                });
            }
            playerRef.current.src = nowPlaying.url;
            playerRef.current.currentTime = nowPlaying.startAt;
            setSecondsPlayed(nowPlaying.startAt);
            if (!isPausedOnPurpose) {
                playerRef.current.play()
                    .then(() => {
                        setIsPaused(false);
                    }).catch(() => {
                        setIsPaused(true);
                    });
            }
        }
    }, [nowPlaying.id, nowPlaying.startAt]);

    React.useEffect(() => {
        const val = window.localStorage.getItem("volume");
        playerRef.current!.volume = val ? +val : 0.3;
    }, []);

    useHotkeys(SHORTCUTS.PLAY_PAUSE, () => {
        setIsPausedOnPurpose((isPausedOnPurpose) => {
            if (isPausedOnPurpose) {
                playerRef.current!.play();
                playerRef.current!.currentTime = secondsPlayed;
                setIsPaused(false);
                return false;
            } else {
                playerRef.current!.pause();
                setIsPaused(true);
                return true;
            }
        });
    }, [secondsPlayed]);

    useHotkeys(SHORTCUTS.SKIP, skip);
    useHotkeys(SHORTCUTS.ADD_CURRENT_SONG_TO_PLAYLIST, () => openModal(nowPlaying.videoId));

    return (
        <div className="player-outer">
            <div className="player-info">
                <div className="player-title" title={ nowPlaying.title }>
                    <TextRoller uid={ nowPlaying.title }>
                        { nowPlaying.title }
                    </TextRoller>
                </div>
                <div className="player-by">
                    <TextRoller uid={ nowPlaying.by.name }>
                        Listening to { nowPlaying.by.name }
                    </TextRoller>
                </div>
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
                <TrackbarV2 uid={ nowPlaying.title } percentage={ (secondsPlayed / nowPlaying.duration) * 100 } onSeek={ handleSeek } seekable={ isOwner } />
            </div>
            <div className="player-far-right">
                <div className="player-duration">
                    { secondsToTime(nowPlaying.duration) }
                </div>
                <div className="player-volume">
                    <VolumeRocker onVolumeChange={ onVolumeChange } />
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