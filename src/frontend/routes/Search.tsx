import * as React             from "react";
import { parse }              from "query-string";
import { RouteChildrenProps } from "react-router";

import Video  from "../components/Video";
import Loader from "../components/Loader";
import Error  from "../components/Error";
import Button from "../components/Button";

import { SEARCH } from "../api";

import useApi from "../hooks/use-api";

type Video = {
    id        : string,
    title     : string,
    thumbnail : string,
    duration  : number
}

const Search: React.FunctionComponent<RouteChildrenProps> = (props) => {

    const { location : { search } } = props;
    const { q } = parse(search);
    const { data : responseData, isLoading, error } = useApi({ ...SEARCH(), params : { q } }, [q]);

    if (isLoading) return <Loader />;
    if (error) return <Error />;
    const { nextPageToken, data: videos } = responseData;
    return (
        <div className="search-grid row">
            { videos.map((item: Video) => (
                <div key={ item.id } className="video-outer col-xs-12 col-sm-6 col-md-4 col-lg-4">
                    <Video { ...item } />
                </div>
            )) }
        </div>
    );
}

export default Search;