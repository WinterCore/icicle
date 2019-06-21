import * as React             from "react";
import { Link, withRouter }   from "react-router-dom";
import { RouteChildrenProps } from "react-router";
import { parse }              from "query-string";


import SearchIcon from "../icons/Search";
import HomeIcon   from "../icons/Home";
import MusicIcon  from "../icons/Music";
import PersonIcon from "../icons/Person";

import Input         from "../components/Input";
import UserLoginCard from "../components/UserLoginCard";

const Header: React.FunctionComponent<RouteChildrenProps> = ({ history, location : { search : query } }) => {
    const [search, setSearch] = React.useState((parse(query).q || "") as string);

    const setSearchInputValue = ({ target }: React.ChangeEvent<HTMLInputElement>) => setSearch(target.value);
    const onSearch            = () => history.push(`/search?q=${search}`);

    return (
        <nav id="sidenav">
            <UserLoginCard />
            <Input
                onChange={ setSearchInputValue }
                value={ search }
                onEnter={ onSearch }
                icon={ <SearchIcon /> }
                placeholder="Search for youtube videos"
            />
            <ul className="main-links">
                <li><Link to="/"><HomeIcon />Home</Link></li>
                <li><Link to="/people"><PersonIcon />People</Link></li>
            </ul>
        </nav>
    );
}

export default withRouter(Header);