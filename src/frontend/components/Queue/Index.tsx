import * as React from "react";
import Axios      from "axios";

import { usePlayer }       from "../../contexts/player";
import { useUser }         from "../../contexts/user";
import { useNotification } from "../../contexts/notification";

import Loader from "../../icons/Loader";

import Error  from "../Error";
import Button from "../Button";

import QueueItem from "./QueueItem";

import api, { GET_QUEUE_ITEMS, CLEAR_QUEUE } from "../../api";

const Queue: React.FunctionComponent = () => {
    const { nowPlaying, roomData } = usePlayer();
    const { user }                 = useUser();
    const { addNotification }      = useNotification();

    const [data, setData]                       = React.useState<QueueItem[]>([]);
    const [isLoading, setIsLoading]             = React.useState<boolean>(!!nowPlaying);
    const [error, setError]                     = React.useState(null);
    const [isClearingQueue, setIsClearingQueue] = React.useState<boolean>(false);

    const clearQueue = () => {
        setIsClearingQueue(true);
        api({
            ...CLEAR_QUEUE()
        }).then(({ data : { message } }) => {
            setIsClearingQueue(false);
            setData([]);
            addNotification({ message });
        }).catch((err) => {
            addNotification({ message : "Something happened while trying to clear your queue" });
            setIsClearingQueue(false);
        });
    };

    const fetchQueue = () => {
        const cancelTokenSource = Axios.CancelToken.source();
        if (!roomData || !nowPlaying || !nowPlaying.by._id) return cancelTokenSource;
        setIsLoading(true);
        api({
            ...GET_QUEUE_ITEMS(roomData._id),
            cancelToken : cancelTokenSource.token
        }).then((response) => {
            setData(response.data.data);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setError(true);
            setIsLoading(false);
        });
        return cancelTokenSource;
    };


    React.useEffect(() => {
        const cancelTokenSource = fetchQueue();
        return () => cancelTokenSource.cancel("CANCELED");
    }, [nowPlaying ? nowPlaying.title : null]);

    return (
        <>
            <h2>Queue</h2>
            <div className="song-outer">
                {
                    error
                    ? <div className="flex-middle"><Error /></div>
                    : (
                        isLoading
                        ? <div className="flex-middle"><Loader /></div>
                        : ( 
                            data.length && roomData && nowPlaying
                                ? (
                                    <>
                                        {
                                            (roomData && user && user._id === roomData._id && data.length) &&
                                                <div style={{ marginBottom : 15 }}>
                                                    <Button disabled={ isClearingQueue } onClick={ clearQueue }>{ isClearingQueue ? "Clearing..." : "Clear queue" }</Button>
                                                </div>
                                        }
                                        { data.map((item: QueueItem) => <QueueItem onDelete={ setData } key={ item._id } { ...item } />) }
                                    </>
                                ) : <h4>There are no items in the queue</h4>
                        )
                    )
                }
            </div>
        </>
    );
};

export default Queue;