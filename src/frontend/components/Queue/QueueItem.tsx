import * as React from "react";

import CrossIcon from "../../icons/Cross";

import { secondsToTime } from "../../helpers";

import { useUser }   from "../../contexts/user";
import { usePlayer } from "../../contexts/player";

import TextRoller from "../TextRoller";

import api, { DELETE_QUEUE_ITEM } from "../../api";

import LoaderIcon from "../../icons/Loader";

const QueueItem: React.FunctionComponent<QueueItemProps> = (props) => {
    const { _id, thumbnail, title, duration, videoId, onDelete } = props;
    const { user }       = useUser();
    const { nowPlaying } = usePlayer();
    const [isLoading, setIsLoading] = React.useState(false);

    const deleteQueueItem = () => {
        setIsLoading(true);
        api({
            ...DELETE_QUEUE_ITEM(_id)
        }).then((response) => {
            setIsLoading(false);
            onDelete(response.data.data);
        }).catch((err) => {
            console.log(err);
            // TODO : show error notification
            setIsLoading(false);
        });
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
                    user && nowPlaying && nowPlaying.by._id === user._id
                        ? (
                            <div className="song-actions">
                                { isLoading ? <LoaderIcon /> : <CrossIcon onClick={ deleteQueueItem } /> }
                            </div>
                        ) : null
                }
            </div>
        </div>
    );
};

interface QueueItemProps extends QueueItem {
    onDelete : {(data: QueueItem[]): void};
}

export default QueueItem;