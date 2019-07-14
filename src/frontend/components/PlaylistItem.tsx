import * as React from "react";

import CrossIcon  from "../icons/Cross";
import PlayIcon   from "../icons/Play";
import LoaderIcon from "../icons/Loader";

import { secondsToTime } from "../helpers";

import { usePlayer }       from "../contexts/player";
import { useNotification } from "../contexts/notification";

import TextRoller from "./TextRoller";

import api, { DELETE_PLAYLIST_ITEM } from "../api";


const PlaylistItem: React.FunctionComponent<PlaylistItemProps> = (props) => {
    const { thumbnail, title, duration, videoId, playlistId, onDelete } = props;

    const { startStream }           = usePlayer();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const { addNotification }       = useNotification();

    const deletePlaylistItem = () => {
        setIsLoading(true);
        api({
            ...DELETE_PLAYLIST_ITEM(playlistId, videoId)
        }).then(() => {
            setIsLoading(false);
            onDelete(videoId);
            addNotification({
                id      : `${Date.now()}`,
                message : `${title} was removed successfully`,
                type    : "success"     
            });
        }).catch((err) => {
            console.log(err);
            setIsLoading(false);
        });
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
                        {/* <div className="song-time-remaining washed-out">Plays in 5 mins</div> */}
                    </div>
                </div>
                <div className="song-duration">
                    { secondsToTime(duration) }
                </div>
                {
                    <div className="song-actions">
                        { <PlayIcon onClick={ playPlaylistItem } /> }
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