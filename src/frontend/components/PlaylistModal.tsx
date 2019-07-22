import * as React     from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { usePlaylists }    from "../contexts/playlists";
import { useNotification } from "../contexts/notification";

import CrossIcon  from "../icons/Cross";
import PlusIcon   from "../icons/Plus";
import LoaderIcon from "../icons/Loader";

import Input  from "./Input";
import Button from "./Button";

import api, { ADD_SONG_TO_PLAYLIST, REMOVE_SONG_FROM_PLAYLIST, CREATE_PLAYLIST } from "../api";

import { SHORTCUTS } from "../helpers";

const PlaylistModal: React.FunctionComponent = () => {
    const { playlists, songPlaylists, isModalOpen, closeModal, videoId, setSongPlaylists, setPlaylists, isLoadingSongPlaylists } = usePlaylists();

    const { addNotification }                   = useNotification();
    const [isCreating, setIsCreating]           = React.useState<boolean>(false);
    const [name, setName]                       = React.useState<string>("");
    const [isLoading, setIsLoading]             = React.useState<boolean>(false);
    const [isCreateLoading, setIsCreateLoading] = React.useState<boolean>(false);

    useHotkeys(SHORTCUTS.CLOSE, closeModal);

    const onNameChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => { setName(target.value) };

    const onModalClose = () => {
        setName("");
        setIsCreating(false);
        closeModal();
    };

    const onCheckboxChange = ({ target : { checked } }, _id: string) => {
        if (isLoading) return;
        setIsLoading(true);
        if (checked) {
            api({
                ...ADD_SONG_TO_PLAYLIST(_id),
                data : { videoId }
            }).then(() => {
                setIsLoading(false)
                addNotification({
                    id      : `${Date.now()}`,
                    message : "Added to the playlist successfully",
                    type    : "success"     
                });
                setSongPlaylists((oldSongPlaylists: string[]) => [...oldSongPlaylists, _id]);
            }).catch((err) => {
                setIsLoading(false);
                console.log(err);
                if (err.response) {
                    addNotification({
                        id      : `${Date.now()}`,
                        message : err.response.data.errors.join("<br />"),
                        type    : "error"
                    });
                }
            });
        } else {
            api({
                ...REMOVE_SONG_FROM_PLAYLIST(_id, videoId),
                data : { videoId }
            }).then(() => {
                setIsLoading(false)
                addNotification({
                    id      : `${Date.now()}`,
                    message : "Removed successfully",
                    type    : "success"     
                });
                setSongPlaylists((oldSongPlaylists: string[]) => oldSongPlaylists.filter(id => id !== _id));
            }).catch((err) => {
                setIsLoading(false);
                console.log(err);
                if (err.response) {
                    addNotification({
                        id      : `${Date.now()}`,
                        message : err.response.data.errors.join("<br />"),
                        type    : "error"
                    });
                }
            });
            
        }
    };

    const createPlaylist = () => {
        if (!name) return;
        setIsCreateLoading(true);
        api({
            ...CREATE_PLAYLIST(),
            data : { name }
        }).then(({ data : { data } }) => {
            setIsCreateLoading(false);
            setName("");
            setPlaylists(oldPlaylists => [...oldPlaylists, data].sort((a, b) => a.name.localeCompare(b.name)));
            addNotification({
                id      : `${Date.now()}`,
                message : `${name} was created successfully`,
                type    : "success"     
            });
        }).catch((err) => {
            setIsCreateLoading(false);
            console.log(err);
            if (err.response) {
                addNotification({
                    id      : `${Date.now()}`,
                    message : err.response.data.errors.join("<br />"),
                    type    : "error"
                });
            }
        });
    };

    React.useLayoutEffect(() => {
        if (isModalOpen) document.body.style.overflowY = "hidden";
        else document.body.style.overflowY = "auto";
    }, [isModalOpen]);

    if (!isModalOpen) return null;

    return (
        <div onClick={ closeModal } className="playlist-modal-backdrop">
            <div onClick={ (e) => e.stopPropagation() } className={ `playlist-modal-outer${isModalOpen ? " active" : ""}` }>
                <div className="playlist-modal-header">
                    <h4>Save to...</h4>
                    <CrossIcon onClick={ onModalClose } />
                </div>
                <div className="playlist-modal-playlists">
                    {
                        isLoadingSongPlaylists
                            ? (
                                <div className="flex-middle">
                                    <LoaderIcon />
                                </div>
                            ) : (
                                playlists.map(({ _id, name }) => (
                                    <div key={ _id } className="playlist-modal-playlist">
                                        <input
                                            id={ `playlist-${_id}` }
                                            className="playlist-modal-playlist-checkbox"
                                            type="checkbox"
                                            checked={ songPlaylists.indexOf(_id) > -1 }
                                            disabled={ isLoading }
                                            onChange={ (e) => onCheckboxChange(e, _id) }
                                        />
                                        <label htmlFor={ `playlist-${_id}` } className="playlist-modal-playlist-name">
                                            { name }
                                        </label>
                                    </div>
                                ))
                            )
                    }
                </div>
                <div className="playlist-modal-footer">
                    {
                        isCreating
                            ? (
                                <div className="playlist-modal-create">
                                    <Input onChange={ onNameChange } value={ name } placeholder="Name" onEnter={ createPlaylist } />
                                    <div className="playlist-modal-create-submit-button">
                                        <Button disabled={ isCreateLoading } onClick={ createPlaylist }>Create</Button>
                                    </div>
                                </div>
                            ) : (
                                <div onClick={ () => setIsCreating(true) } className="playlist-modal-create-button">
                                    <PlusIcon />
                                    <span>{ isCreateLoading ? "Creating..." : "Create new playlist" }</span>
                                </div>
                            )
                    }
                </div>
            </div>
        </div>
    );
};

export default PlaylistModal;