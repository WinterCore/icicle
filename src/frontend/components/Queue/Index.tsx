import * as React from "react";
import Axios      from "axios";

import { usePlayer } from "../../contexts/player";

import Error from "../Error";
import Loader from "../../icons/Loader";

import api, { GET_QUEUE_ITEMS } from "../../api";
import QueueItem from "./QueueItem";

const Queue: React.FunctionComponent = () => {
    const { nowPlaying }            = usePlayer();

    const [data, setData]           = React.useState<QueueItem[] | null>(null);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);
    const [error, setError]         = React.useState(null);

    const fetchQueue = () => {
        setIsLoading(true);
        const cancelTokenSource = Axios.CancelToken.source();
        api({
            ...GET_QUEUE_ITEMS(nowPlaying.by._id),
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
    }, []);

    React.useEffect(() => {
        if (data) {
            setData(data.filter((item: QueueItem) => nowPlaying.title !== item.title));
        }
    }, [nowPlaying.title]);

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

const IfQueue: React.FunctionComponent = () => {
    const { nowPlaying } = usePlayer();

    if (!nowPlaying) return null;
    return <Queue />
};

export default IfQueue;