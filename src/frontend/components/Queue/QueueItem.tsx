import * as React from "react";

import CrossIcon from "../../icons/Cross";

import { secondsToTime } from "../../helpers";

import { useUser }   from "../../contexts/user";
import { usePlayer } from "../../contexts/player";

import api, { DELETE_QUEUE_ITEM } from "../../api";

import LoaderIcon from "../../icons/Loader";

const QueueItem: React.FunctionComponent<QueueItemProps> = (props) => {
    const { thumbnail, title, duration, videoId, onDelete } = props;
    const { user }       = useUser();
    const { nowPlaying } = usePlayer();
    const [isLoading, setIsLoading] = React.useState(false);

    const deleteQueueItem = () => {
        setIsLoading(true);
        api({
            ...DELETE_QUEUE_ITEM(),
            params : { id : videoId }
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
        <div className="queue-item-outer">
            <div className="queue-item">
                <div className="queue-item-image" style={{ backgroundImage : `url(${thumbnail})` }}></div>
                <div className="queue-item-middle-outer">
                    <div className="queue-item-info">
                        <div className="queue-item-name">{ title }</div>
                        {/* <div className="queue-item-time-remaining washed-out">Plays in 5 mins</div> */}
                    </div>
                </div>
                <div className="queue-item-duration">
                    { secondsToTime(duration) }
                </div>
                {
                    user && nowPlaying.by._id === user._id
                        ? (
                            <div className="queue-item-actions">
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