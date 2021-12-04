import * as React             from "react";
import Axios                  from "axios";

import Queue  from "../components/Queue/Index";
import Button from "../components/Button";

import { usePlayer }       from "../contexts/player";
import { useUser }         from "../contexts/user";
import { usePlaylists }    from "../contexts/playlists";
import { useNotification } from "../contexts/notification";

import api, { CREATE_INVITE_LINK } from "../api";

import { copyTextToClipboard } from "../helpers";

import Chat from "../components/Chat/Index";

const Home: React.FunctionComponent = () => {
    const { roomData, nowPlaying, leaveStream, terminateStream } = usePlayer();
    const { user }                                               = useUser();
    const { openModal }                                          = usePlaylists();
    const { addNotification }                                    = useNotification();

    const [isCreatingInviteLink, setIsCreatingInviteLink] = React.useState<boolean>(false);

    const createInviteLink = () => {
        setIsCreatingInviteLink(true);
        api({ ...CREATE_INVITE_LINK() })
            .then(({ data : { data } }) => {
                setIsCreatingInviteLink(false);
                copyTextToClipboard(data)
                    .then(() => {
                        addNotification({ message : "A new invite link has been copied to the clipboard." });
                    }).catch(() => {
                        addNotification({
                            message : `Something happened while trying to copy the invite link to your clipboard. You can copy it from here <a target="_blank" href="${data}">${data}</a>`,
                            time    : 10000
                        });
                    });
            }).catch((err) => {
                setIsCreatingInviteLink(false);
                console.log(err);
                addNotification({ message : "Something happened while trying to create an invite link", type : "error" });
            });
    };

    return (
        <div className="row" style={{ margin : "10px 20px" }}>
            {
                roomData
                    ? (
                        <div className="col-xs-12">
                            <h2>{ roomData.name }'s Room</h2>
                            <h4>
                                <div className="washed-out">{ roomData.liveListeners } listeners</div>
                                {
                                    nowPlaying
                                        ? (
                                            <>
                                                <span className="washed-out">Listening to</span>
                                                &nbsp;{ nowPlaying.title }
                                            </>
                                        ) : "Nothing is currently playing"
                                }
                            </h4>
                            <div className="action-buttons">
                                {
                                    nowPlaying && user &&
                                        <div>
                                            <Button onClick={ () => openModal(nowPlaying.videoId) }>Add to playlist</Button>
                                        </div>
                                }
                                {
                                    roomData && user && user._id === roomData._id && // only if the user is the owner of the stream
                                        <div>
                                            <Button onClick={ terminateStream }>End stream</Button>
                                        </div>
                                }
                                {
                                    roomData && (!user || user._id !== roomData._id) && // only if the user is not the owner of the stream
                                        <div>
                                            <Button onClick={ leaveStream }>Leave</Button>
                                        </div>
                                }
                                {
                                    (user && roomData && roomData._id === user._id) &&
                                        <div>
                                            <Button disabled={ isCreatingInviteLink } onClick={ createInviteLink }>{ isCreatingInviteLink ? "Creating..." : "Create invite link" }</Button>
                                        </div>
                                }
                            </div>
                        </div>
                    ) : <h2 className="col-xs-12">Please join a room to start listening to music</h2>
            }
            <div className="col-xs-12 col-md-6 queue-section">
                <Queue />
            </div>
        </div>
    );
};


export default Home;
