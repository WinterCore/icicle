import * as React from "react";

import CrossIcon  from "../icons/Cross";
import PlayIcon   from "../icons/Play";
import LoaderIcon from "../icons/Loader";
import WatchIcon  from "../icons/Watch";

import { secondsToTime } from "../helpers";

import { usePlayer }       from "../contexts/player";
import { useNotification } from "../contexts/notification";
import { useUser }         from "../contexts/user";
import { usePlaylists }    from "../contexts/playlists";

import TextRoller from "./TextRoller";

import api, { DELETE_PLAYLIST_ITEM, ADD_TO_QUEUE } from "../api";
import AddToPlaylistIcon from "../icons/AddToPlaylist";


const PlaylistItem: React.FunctionComponent<PlaylistItemProps> = (props) => {
    const { thumbnail, title, duration, videoId, playlistId, onDelete } = props;

    const [isLoading, setIsLoading]                     = React.useState<boolean>(false);
    const [isAddToQueueLoading, setIsAddToQueueLoading] = React.useState<boolean>(false);

    const { play, startStream } = usePlayer();
    const { addNotification }   = useNotification();
    const { openModal }         = usePlaylists();

    const deletePlaylistItem = () => {
        setIsLoading(true);
        api({
            ...DELETE_PLAYLIST_ITEM(playlistId, videoId)
        }).then(() => {
            setIsLoading(false);
            onDelete(videoId);
            addNotification({ message : `${title} was removed successfully` });
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
    };

    const addToQueue = async (e: React.MouseEvent<SVGElement, MouseEvent>) => {
        e.preventDefault();
        setIsAddToQueueLoading(true);
        try {
            await api({ ...ADD_TO_QUEUE(), data : { id : videoId } });
            addNotification({ message : `${title} has been added to the queue.` });
            play();
            setIsAddToQueueLoading(false);
        } catch(e) {
            console.log(e);
            
            setIsAddToQueueLoading(false);
            if (e.response && e.response.status === 422) {
                addNotification({ message : e.response.data.errors, type : "error" });
            }
        }
    };

    const playPlaylistItem = () => {
        startStream(videoId);
    };

    return (
        <div className="song-outer">
            <div className="song">
                <div className="song-image" style={{ backgroundImage : `url(${thumbnail})` }}></div>
                <div className="song-middle-outer">
                    <div className="song-info">
                        <div className="song-name">
                            <TextRoller>
                                { title }
                            </TextRoller>
                        </div>
                    </div>
                </div>
                <div className="song-duration">
                    { secondsToTime(duration) }
                </div>
                {
                    <div className="song-actions">
                        { isAddToQueueLoading ? <LoaderIcon /> : <WatchIcon onClick={ addToQueue } /> }
                        <PlayIcon onClick={ playPlaylistItem } />
                        <AddToPlaylistIcon onClick={ () => openModal(videoId) } />
                        { isLoading ? <LoaderIcon /> : <CrossIcon onClick={ deletePlaylistItem } /> }
                    </div>
                }
            </div>
        </div>
    );
};

interface PlaylistItemProps extends Entities.Song {
    playlistId : string;
    onDelete   : {(videoId: string): any};
}

export default PlaylistItem;