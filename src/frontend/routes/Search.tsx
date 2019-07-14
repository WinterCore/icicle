import { parse } from "query-string";
import * as React from "react";
import { RouteChildrenProps } from "react-router";
import Axios from "axios";
import Error from "../components/Error";
import Video from "../components/Video";
import Loader from "../icons/Loader";

import api, { SEARCH } from "../api";

const PLAYER_HEIGHT = 100;


type Video = {
    id        : string;
    title     : string;
    thumbnail : string;
    duration  : number;
};

const Search: React.FunctionComponent<RouteChildrenProps> = (props) => {

    const { location : { search } }         = props;
    const { q }                             = parse(search);
    const [nextPageToken, setNextPageToken] = React.useState(null);
    const [isLoadingMore, setIsLoadingMore] = React.useState(false);
    const [data, setData]                   = React.useState(null);
    const [isLoading, setIsLoading]         = React.useState(true);
    const [error, setError]                 = React.useState(null);

    const containerRef = React.useRef<HTMLDivElement>(null);


    // TODO: refactor the api calls into a hook

    const loadMore = () => {
        setIsLoadingMore(true);
        api({
            ...SEARCH(),
            params : { q, nextPageToken }
        }).then((response) => {
            setData([...data, ...response.data.data]);
            setNextPageToken(response.data.nextPageToken);
            setIsLoadingMore(false);
        }).catch((err) => {
            console.log(err);
            setIsLoadingMore(false);
            // setError(true);
        });
    };

    const updatePosition = () => {
        const { height } = containerRef.current.getBoundingClientRect();
        if (!isLoading && !isLoadingMore && nextPageToken && (height - window.scrollY + 100) < window.innerHeight)
            loadMore();
    };

    React.useEffect(() => {
        window.addEventListener("scroll", updatePosition);
        return () => window.removeEventListener("scroll", updatePosition);
    });

    React.useEffect(() => {
        if (!isLoading) updatePosition();
    }, [isLoading]);

    React.useEffect(() => {
        setIsLoading(true);
        const cancelTokenSource = Axios.CancelToken.source();
        api({
            ...SEARCH(),
            params : { q },
            cancelToken : cancelTokenSource.token
        }).then((response) => {
            setData(response.data.data);
            setNextPageToken(response.data.nextPageToken);
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            setError(true);
            setIsLoading(false);
        });
        return () => cancelTokenSource.cancel("CANCELED");
    }, [q]);

    if (isLoading) return <div className="flex-middle"><Loader /></div>;
    if (error) return <div className="flex-middle"><Error /></div>;

    return (
        <div ref={ containerRef } className="search-grid row">
            { data.map((item: Video) => (
                <div key={ item.id } className="video-outer col-xs-12 col-sm-6 col-md-4 col-lg-3">
                    <Video { ...item } />
                </div>
            )) }
            <div className="flex-middle col-xs-12" style={{ marginTop : 20 }}>
                { isLoadingMore && <Loader /> }
            </div>
        </div>
    );
}

export default Search;