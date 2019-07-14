import * as React             from "react";
import { Link, withRouter }   from "react-router-dom";
import { RouteChildrenProps } from "react-router";
import { parse }              from "query-string";


import SearchIcon    from "../icons/Search";
import HomeIcon      from "../icons/Home";
import HamburgerIcon from "../icons/Hamburger";
import PersonIcon    from "../icons/Person";
import IcicleIcon    from "../icons/Icicle";
import InfoIcon      from "../icons/Info";

import Input            from "../components/Input";
import UserLoginCard    from "../components/UserLoginCard";

import { usePlaylists } from "../contexts/playlists";
import { useUser }      from "../contexts/user";

const Header: React.FunctionComponent<RouteChildrenProps> = ({ history, location : { search : query, pathname } }) => {
    const [search, setSearch]       = React.useState((parse(query).q || "") as string);
    const [isVisible, setIsVisible] = React.useState(false);
    const { playlists }             = usePlaylists();
    const { user }                  = useUser();

    const setSearchInputValue  = ({ target }: React.ChangeEvent<HTMLInputElement>) => setSearch(target.value);
    const onSearch             = () => search && history.push(`/search?q=${search}`);
    const handleHamburgerClick = () => setIsVisible(!isVisible);

    return (
        <>
            <nav id="sidenav" className={ isVisible ? "visible" : "" }>
                <IcicleIcon />
                <UserLoginCard />
                <div className="search-input">
                    <Input
                        onChange={ setSearchInputValue }
                        value={ search }
                        onEnter={ onSearch }
                        icon={ <SearchIcon onClick={ onSearch } /> }
                        placeholder="Search for youtube videos"
                    />
                </div>
                <ul className="links">
                    <li className={ pathname === "/" ? "active" : "" }><Link to="/"><HomeIcon />Home</Link></li>
                    <li className={ pathname === "/people" ? "active" : "" }><Link to="/people"><PersonIcon />People</Link></li>
                    <li className={ pathname === "/about" ? "active" : "" }><Link to="/about"><InfoIcon />About</Link></li>
                </ul>
                {
                    user && (
                        <>
                            <div className="section-divider">Playlists</div>
                            <ul className="links">
                                {
                                    playlists.map(({ _id, name }) => (
                                        <li className={ pathname === `/playlist/${_id}` ? "active" : "" } key={ _id }>
                                            <Link to={ `/playlist/${_id}` }>{ name }</Link>
                                        </li>
                                    ))
                                }
                            </ul>
                        </>
                    )
                }
            </nav>
            <HamburgerIcon onClick={ handleHamburgerClick } />
        </>
    );
}

export default withRouter(Header);