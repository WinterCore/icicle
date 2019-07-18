import * as React             from "react";
import Axios                  from "axios";
import { RouteChildrenProps } from "react-router";

import Queue  from "../components/Queue/Index";
import Button from "../components/Button";

import { usePlayer }    from "../contexts/player";
import { useUser }      from "../contexts/user";
import { usePlaylists } from "../contexts/playlists";

import Chat from "../components/Chat/Index";

const Home: React.FunctionComponent<RouteChildrenProps> = ({  }) => {
    const { roomData, nowPlaying, leaveStream } = usePlayer();
    const { user }                              = useUser();
    const { openModal }                         = usePlaylists();

    return (
        <div className="row" style={{ margin : "10px 20px" }}>
            {
                roomData
                    ? (
                        <div className="col-xs-12">
                            <h2>{ roomData.name }'s Room</h2>
                            <h4>
                                {
                                    nowPlaying
                                        ? (
                                            <>
                                                <span className="washed-out">Listening to</span>
                                                &nbsp;{ nowPlaying.title }
                                                {
                                                    nowPlaying.liveListeners > 0
                                                    ? (
                                                        <>
                                                            &nbsp;<span className="washed-out">with</span>
                                                            &nbsp;{ nowPlaying.liveListeners }
                                                            &nbsp;{ nowPlaying.liveListeners > 1 ? "others" : "other person" }
                                                        </>
                                                    ) : null
                                                }
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
                                    roomData && (!user || user._id !== roomData._id) && // only if the user is not the owner of the stream
                                        <div>
                                            <Button onClick={ () => leaveStream() }>Leave</Button>
                                        </div>
                                }
                            </div>
                        </div>
                    ) : <h2 className="col-xs-12">Please join a room to start listening to music</h2>
            }
            {/* <div className="col-xs-12 col-md-6 chat-section">
                <Chat />
            </div> */}
            <div className="col-xs-12 col-md-6 queue-section">
                <Queue />
            </div>
        </div>
    );
};


export default Home;