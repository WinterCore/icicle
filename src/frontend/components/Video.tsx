import * as React from "react";

import WatchIcon          from "../icons/Watch";
import PlayIcon           from "../icons/Play";
import Loader             from "../icons/Loader";
import AddToPlaylistIcon  from "../icons/AddToPlaylist";

import { usePlayer }       from "../contexts/player";
import { useUser }         from "../contexts/user";
import { useNotification } from "../contexts/notification";
import { usePlaylists }    from "../contexts/playlists";

import TextRoller from "../components/TextRoller";

import api, { ADD_TO_QUEUE } from "../api";

const Video: React.FunctionComponent<VideoProps> = (props) => {
    const { id, title, thumbnail }                      = props;
    const [isAddToQueueLoading, setIsAddToQueueLoading] = React.useState(false);
    const [isPlayNowLoading, setIsPlayNowLoading]       = React.useState(false);
    const { play, nowPlaying, startStream }             = usePlayer();
    const { addNotification }                           = useNotification();
    const { openModal }                                 = usePlaylists();
    const { user }                                      = useUser();

    const onPlayNow = () => {
        if (!user) {
            addNotification({
                message : "You need to login before you can start your own stream and play videos.",
                type : "error"
            });
            return;
        }
        if (nowPlaying ? nowPlaying.title !== title : true) {
            setIsPlayNowLoading(true);
            startStream(id);
        }
    };
    const addToQueue = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
        e.preventDefault();
        setIsAddToQueueLoading(true);
        try {
            await api({ ...ADD_TO_QUEUE(), data : { id } });
            addNotification({ message : `${title} has been added to the queue.` });
            setIsAddToQueueLoading(false);
            play();
        } catch(e) {
            // @ts-ignore
            if (e.response && e.response.status === 422) {
                addNotification({
                    // @ts-ignore
                    message : e.response.data.errors,
                    type : "error"
                });
            }
        }
    };

    React.useEffect(() => {
        if (nowPlaying && title === nowPlaying.title) setIsPlayNowLoading(false);
    }, [nowPlaying && nowPlaying.title]);

    return (
        <div className="song-outer">
            <div className="song">
                <div className="song-image" style={{ backgroundImage : `url(${thumbnail})` }}></div>
                <div className="song-middle-outer">
                    <div className="song-info">
                        <div className="song-name">
                            <TextRoller>
                                <span dangerouslySetInnerHTML={{ __html : title }} />
                            </TextRoller>
                        </div>
                    </div>
                </div>
                {
                    <div className="song-actions">
                        { user ? (!isAddToQueueLoading ? <WatchIcon onClick={ addToQueue } /> : <Loader />) : <div /> }
                        { isPlayNowLoading ? <Loader /> : <PlayIcon onClick={ onPlayNow } /> }
                        { user ? <AddToPlaylistIcon onClick={ () => openModal(id) } /> : <div /> }
                    </div>
                }
            </div>
        </div>
    );
};





interface VideoProps {
    id        : string;
    title     : string;
    thumbnail : string;
}

export default Video;
