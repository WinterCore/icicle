import * as React from "react";
import { GET_PEOPLE } from "../api";

import useApi from "../hooks/use-api";

import Error      from "../components/Error";
import Trackbar   from "../components/Trackbar";
import TextRoller from "../components/TextRoller";

import Loader   from "../icons/Loader";
import PlayIcon from "../icons/Play";

import { usePlayer } from "../contexts/player";

const Person: React.FunctionComponent<PersonProps> = (props) => {
    const { _id, name, picture, nowPlaying, liveListeners } = props;
    const { joinStream, roomData } = usePlayer();

    const onPlay = () => joinStream(_id);

    return (
        <div className="person-outer">
            <div className="person">
                <div className="person-image"><img src={ picture } /></div>
                <div className="person-middle-outer">
                    <div className="person-info">
                        <TextRoller uid={ nowPlaying.title }>
                            <span className="person-name">{ name }</span>&nbsp;<span className="washed-out">is listening to</span>&nbsp;<span className="person-listening-to">{ nowPlaying.title }</span>
                            { liveListeners > 0 && (
                                <>
                                    &nbsp;<span className="washed-out">with</span>
                                    &nbsp;{ liveListeners }&nbsp;
                                    <span className="washed-out">{ liveListeners > 1 ? "others" : "other person" }</span>
                                </>
                            ) }
                        </TextRoller>
                    </div>
                </div>
                <div className="person-actions">
                    { (!roomData || roomData._id !== _id) && <PlayIcon onClick={ onPlay } /> }
                </div>
            </div>
        </div>
    );
};


interface PersonProps {
    _id           : string;
    name          : string;
    picture       : string;
    liveListeners : number;
    nowPlaying    : {
        picture  : string;
        title    : string;
        url      : string;
        duration : number;
        startAt  : number;
    };
}


interface PeopleResponseData {
    nextPageToken : string;
    data          : PersonProps[];
}

const People: React.FunctionComponent = () => {
    const { data : responseData, isLoading, error } = useApi({ ...GET_PEOPLE() });
    if (isLoading) return <div className="flex-middle"><Loader /></div>;
    if (error) return <div className="flex-middle"><Error /></div>;
    const { nextPageToken, data }: PeopleResponseData = responseData;

    return (
        <div className="people-section">
            { data.map((item) => <Person key={ item._id } { ...item } />) }
        </div>
    );
}

export default People;