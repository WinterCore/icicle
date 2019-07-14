import * as React             from "react";
import { RouteChildrenProps } from "react-router";
import Axios                  from "axios";


import Loader from "../icons/Loader";

import Error        from "../components/Error";
import PlaylistItem from "../components/PlaylistItem";
import Button       from "../components/Button";

import { useNotification } from "../contexts/notification";
import { usePlaylists }    from "../contexts/playlists";
import { usePlayer }       from "../contexts/player";
import { useUser }         from "../contexts/user";

import api, { GET_PLAYLISTS_ITEMS, DELETE_PLAYLIST, QUEUE_PLAYLIST } from "../api";

type Params = {
    id: string;
};

const Search: React.FunctionComponent<RouteChildrenProps<Params>> = ({ match : { params : { id } }, history }) => {
    const [data, setData]                                     = React.useState<Entities.Song[]>([]);
    const [isLoading, setIsLoading]                           = React.useState<boolean>(true);
    const [isDeleteLoading, setIsDeleteLoading]               = React.useState<boolean>(false);
    const [isAddingToQueueLoading, setIsAddingToQueueLoading] = React.useState<boolean>(false);
    const [error, setError]                                   = React.useState<boolean>(false);
    const [confirmDelete, setConfirmDelete]                   = React.useState<boolean>(null);
    const { addNotification }                                 = useNotification();
    const { setPlaylists }                                    = usePlaylists();
    const { nowPlaying, startStream }                         = usePlayer();
    const { user }                                            = useUser();

    React.useEffect(() => {
        setIsLoading(true);
        const cancelTokenSource = Axios.CancelToken.source();
        api({
            ...GET_PLAYLISTS_ITEMS(id),
            cancelToken : cancelTokenSource.token
        }).then((response) => {
            setData(response.data.data);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setError(true);
            setIsLoading(false);
        });
        return () => cancelTokenSource.cancel("CANCELED");
    }, [id]);

    const handleItemDelete = (videoId: string) => setData(data => data.filter(item => item.videoId !== videoId));

    const onPlaylistDelete = () => {
        if (!confirmDelete) return setConfirmDelete(true);
        setIsDeleteLoading(true);
        api({
            ...DELETE_PLAYLIST(id)
        }).then(({ data : { message } }) => {
            setIsDeleteLoading(false);
            addNotification({
                id      : `${Date.now()}`,
                message : message,
                type    : "success"     
            });
            setPlaylists(playlists => playlists.filter(playlist => playlist._id !== id));
            history.push("/");
        }).catch((err) => {
            console.log(err);
            setIsDeleteLoading(false);
        });
    };

    const addToQueue = () => {
        if (!data.length) {
            return addNotification({
                id      : `${Date.now()}`,
                message : "There are no songs in this playlist to be added",
                type    : "error"     
            });
        }
        setIsAddingToQueueLoading(true);
        api({
            ...QUEUE_PLAYLIST(id)
        }).then(({ data : { message } }) => {
            setIsAddingToQueueLoading(false);
            addNotification({
                id      : `${Date.now()}`,
                message : message,
                type    : "success"     
            });
            if (!nowPlaying || nowPlaying.by._id !== user._id) { // Start a stream if the user is not already in one or if the current stream is not the user's
                startStream(data[0].videoId);
            }
            history.push("/");
        }).catch((err) => {
            console.log(err);
            setIsAddingToQueueLoading(false);
        });
    };

    if (isLoading) return <div className="flex-middle"><Loader /></div>;
    if (error) return <div className="flex-middle"><Error /></div>;
    return (
        <div className="playlist-outer">
            <div className="playlist-actions">
                <Button disabled={ isAddingToQueueLoading } onClick={ addToQueue }>{ isAddingToQueueLoading ? "Adding..." : "Add to the queue" }</Button>
                <Button disabled={ isDeleteLoading } onClick={ onPlaylistDelete }>{ confirmDelete ? (isDeleteLoading ? "Deleting..." : "Are you sure ?") : "Delete playlist" }</Button>
            </div>
            <div className="playlist-items">
                {
                    data.length
                        ? data.map(item => <PlaylistItem key={ item._id } playlistId={ id }  { ...item } onDelete={ handleItemDelete } />)
                        : <h4 style={{ textAlign : "center" }}>There are no items in this playlist</h4>
                }
            </div>
        </div>
    );
}

export default Search;