import * as React              from "react";
import { RouteComponentProps } from "react-router";
import Axios                   from "axios";


import Loader     from "../icons/Loader";
import SearchIcon from "../icons/Search";

import Error        from "../components/Error";
import PlaylistItem from "../components/PlaylistItem";
import Button       from "../components/Button";

import { useNotification } from "../contexts/notification";
import { usePlaylists }    from "../contexts/playlists";
import { usePlayer }       from "../contexts/player";

import Input from "../components/Input";

import api, { GET_PLAYLISTS_ITEMS, DELETE_PLAYLIST, QUEUE_PLAYLIST } from "../api";

type Params = {
    id: string;
};

const Search: React.FunctionComponent<RouteComponentProps<Params>> = ({ match : { params : { id } }, history }) => {
    const [data, setData]                                     = React.useState<Entities.Song[]>([]);
    const [filteredData, setFilteredData]                     = React.useState<Entities.Song[]>([]);
    const [isLoading, setIsLoading]                           = React.useState<boolean>(true);
    const [isDeleteLoading, setIsDeleteLoading]               = React.useState<boolean>(false);
    const [isAddingToQueueLoading, setIsAddingToQueueLoading] = React.useState<boolean>(false);
    const [error, setError]                                   = React.useState<boolean>(false);
    const [confirmDelete, setConfirmDelete]                   = React.useState<boolean>(false);
    const [search, setSearch]                                 = React.useState<string>("");

    const { addNotification } = useNotification();
    const { setPlaylists }    = usePlaylists();
    const { play }            = usePlayer();

    React.useEffect(() => {
        setIsLoading(true);
        setError(false);
        setConfirmDelete(false);
        setSearch("");
        setIsAddingToQueueLoading(false);
        const cancelTokenSource = Axios.CancelToken.source();
        api({
            ...GET_PLAYLISTS_ITEMS(id),
            cancelToken : cancelTokenSource.token
        }).then((response) => {
            setData(response.data.data);
            setFilteredData(response.data.data);
            setIsLoading(false);
        }).catch(({ message }) => {
            if (message === "CANCELED") return;
            setError(true);
            setIsLoading(false);
        });
        return () => cancelTokenSource.cancel("CANCELED");
    }, [id]);

    
    const onSearchChange  = React.useCallback(({ target }: React.ChangeEvent<HTMLInputElement>) => setSearch(target.value), []);
    const onSearch = () => {
        if (search) {
            setFilteredData(data.filter(item => item.title.toLowerCase().indexOf(search.trim().toLowerCase()) > -1));
        } else {
            setFilteredData(data);
        }
    };

    const handleItemDelete = (videoId: string) => {
        setData(data => data.filter(item => item.videoId !== videoId));
        setFilteredData(data.filter(item => item.videoId !== videoId));
    };

    const onPlaylistDelete = () => {
        if (!confirmDelete) return setConfirmDelete(true);
        setIsDeleteLoading(true);
        api({
            ...DELETE_PLAYLIST(id)
        }).then(({ data : { message } }) => {
            setIsDeleteLoading(false);
            addNotification({ message });
            setPlaylists(playlists => playlists.filter(playlist => playlist._id !== id));
            history.push("/");
        }).catch((err) => {
            console.log(err);
            setIsDeleteLoading(false);
        });
    };

    const addToQueue = () => {
        if (!data.length) return addNotification({ message : "There are no songs in this playlist to be added", type : "error" });
        setIsAddingToQueueLoading(true);

        api({
            ...QUEUE_PLAYLIST(id)
        }).then(({ data : { message } }) => {
            setIsAddingToQueueLoading(false);
            addNotification({ message });
            play();
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
            <div className="playlist-header">
                <div className="playlist-search-box">
                    <Input onChange={ onSearchChange } value={ search } onEnter={ onSearch } icon={ <SearchIcon onClick={ onSearch } /> } />
                </div>
                <div className="playlist-actions">
                    <Button disabled={ isAddingToQueueLoading } onClick={ addToQueue }>{ isAddingToQueueLoading ? "Adding..." : "Add to the queue" }</Button>
                    <Button disabled={ isDeleteLoading } onClick={ onPlaylistDelete }>{ confirmDelete ? (isDeleteLoading ? "Deleting..." : "Are you sure ?") : "Delete playlist" }</Button>
                </div>
            </div>
            <div className="playlist-items">
                {
                    filteredData.length
                        ? filteredData.map(item => <PlaylistItem key={ item._id } playlistId={ id }  { ...item } onDelete={ handleItemDelete } />)
                        : <h4 style={{ textAlign : "center" }}>There are no items in this playlist</h4>
                }
            </div>
        </div>
    );
}

export default Search;