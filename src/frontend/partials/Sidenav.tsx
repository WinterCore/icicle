import * as React             from "react";
import { Link, withRouter }   from "react-router-dom";
import { RouteChildrenProps } from "react-router";
import { parse }              from "query-string";


import SearchIcon    from "../icons/Search";
import HomeIcon      from "../icons/Home";
import HamburgerIcon from "../icons/Hamburger";
import PersonIcon    from "../icons/Person";
import IcicleIcon    from "../icons/Icicle";

import Input         from "../components/Input";
import UserLoginCard from "../components/UserLoginCard";

const Header: React.FunctionComponent<RouteChildrenProps> = ({ history, location : { search : query } }) => {
    const [search, setSearch]       = React.useState((parse(query).q || "") as string);
    const [isVisible, setIsVisible] = React.useState(false);

    const setSearchInputValue  = ({ target }: React.ChangeEvent<HTMLInputElement>) => setSearch(target.value);
    const onSearch             = () => history.push(`/search?q=${search}`);
    const handleHamburgerClick = () => setIsVisible(!isVisible);

    return (
        <>
            <nav id="sidenav" className={ isVisible ? "visible" : "" }>
                <IcicleIcon />
                <UserLoginCard />
                <Input
                    onChange={ setSearchInputValue }
                    value={ search }
                    onEnter={ onSearch }
                    icon={ <SearchIcon onClick={ onSearch } /> }
                    placeholder="Search for youtube videos"
                />
                <ul className="main-links">
                    <li><Link to="/"><HomeIcon />Home</Link></li>
                    <li><Link to="/people"><PersonIcon />People</Link></li>
                </ul>
            </nav>
            <HamburgerIcon onClick={ handleHamburgerClick } />
        </>
    );
}

export default withRouter(Header);