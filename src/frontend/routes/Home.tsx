import * as React             from "react";
import Axios                  from "axios";
import { RouteChildrenProps } from "react-router";

import Queue from "../components/Queue/Index";

import { usePlayer } from "../contexts/player";


const Home: React.FunctionComponent<RouteChildrenProps> = ({  }) => {
    const { roomData, nowPlaying } = usePlayer();


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
                                            </>
                                        ) : "Nothing is currently playing"
                                }
                            </h4>
                        </div>
                    ) : <h2>Please join a room to start listening to music</h2>
            }
            <div className="col-xs-12 col-md-6 queue-section">
                <Queue />
            </div>
            <div className="col-xs-12 col-md-6 chat-section">
                 
            </div>
        </div>
    );
};


export default Home;