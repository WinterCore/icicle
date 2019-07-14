import * as React from "react";
import Axios      from "axios";

import { usePlayer } from "../../contexts/player";

import Error from "../Error";
import Loader from "../../icons/Loader";

import api, { GET_QUEUE_ITEMS } from "../../api";
import QueueItem from "./QueueItem";

const Queue: React.FunctionComponent = () => {
    const { nowPlaying, roomData } = usePlayer();

    const [data, setData]           = React.useState<QueueItem[]>([]);
    const [isLoading, setIsLoading] = React.useState<boolean>(!!nowPlaying);
    const [error, setError]         = React.useState(null);

    const fetchQueue = () => {
        const cancelTokenSource = Axios.CancelToken.source();
        if (!roomData || !nowPlaying) return cancelTokenSource;
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
                            data.length
                                ? data.map((item: QueueItem) => <QueueItem onDelete={ setData } key={ item._id } { ...item } />)
                                : <h4>There are no items in the queue</h4>
                        )
                    )
                }
            </div>
        </>
    );
};

export default Queue;