import { parse } from "query-string";
import * as React from "react";
import { RouteChildrenProps } from "react-router";
import { SEARCH } from "../api";
import Error from "../components/Error";
import Video from "../components/Video";
import useApi from "../hooks/use-api";
import Loader from "../icons/Loader";





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
    if (isLoading) return <div className="flex-middle"><Loader /></div>;
    if (error) return <div className="flex-middle"><Error /></div>;
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