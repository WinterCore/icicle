import * as React              from "react";
import { Link, withRouter }    from "react-router-dom";
import { RouteComponentProps } from "react-router";
import { parse }               from "query-string";


import SearchIcon    from "../icons/Search";
import HomeIcon      from "../icons/Home";
import HamburgerIcon from "../icons/Hamburger";
import PersonIcon    from "../icons/Person";
import IcicleIcon    from "../icons/Icicle";
import InfoIcon      from "../icons/Info";
import GearIcon      from "../icons/Gear";
import PlusIcon      from "../icons/Plus";

import Input            from "../components/Input";
import UserLoginCard    from "../components/UserLoginCard";

import { usePlaylists }    from "../contexts/playlists";
import { useUser }         from "../contexts/user";
import { useNotification } from "../contexts/notification";

import api, { IMPORT_YOUTUBE_PLAYLIST } from "../api";
import LoaderIcon from "../icons/Loader";

const Sidenav: React.FC<RouteComponentProps> = ({ history, location : { search : query, pathname } }) => {
    const [search, setSearch]                                   = React.useState((parse(query).q || "") as string);
    const [playlistUrl, setPlaylistUrl]                         = React.useState("");
    const [isImportPlaylistLoading, setIsImportPlaylistLoading] = React.useState(false);
    const [isVisible, setIsVisible]                             = React.useState(false);
    const { playlists }                                         = usePlaylists();
    const { user }                                              = useUser();
    const { addNotification }                                   = useNotification();

    const setSearchInputValue         = ({ target }: React.ChangeEvent<HTMLInputElement>) => setSearch(target.value);
    const setPlaylistImportInputValue = ({ target }: React.ChangeEvent<HTMLInputElement>) => setPlaylistUrl(target.value);
    const onSearch                    = () => search && history.push(`/search?q=${search}`);
    const handleHamburgerClick        = () => setIsVisible(!isVisible);

    const onPlaylistImport = () => {
        if (isImportPlaylistLoading) return;
        const playlistId = playlistUrl.match(/(?:\&|\?)list=(.+)(?:&|$)/);
        if (!playlistId) {
            return addNotification({ type : "error", message: "Please enter a valid playlist url" })
        }
        console.log(playlistId);
        setIsImportPlaylistLoading(true);
        api({
            ...IMPORT_YOUTUBE_PLAYLIST(),
            data : { playlistId : playlistId[1] }
        }).then((response) => {
            addNotification({ message : response.data.message });
            setIsImportPlaylistLoading(false);
        }).catch((err) => {
            setIsImportPlaylistLoading(false);
            console.log(err);
            if (err.response) {
                addNotification({ type : "error", message : err.response.data.errors.join("<br />") });
            }
        });
    };

    React.useEffect(() => {
        return history.listen(() => {
            setIsVisible(false);
        });
    }, []);

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
                    { user && <li className={ pathname === "/settings" ? "active" : "" }><Link to="/settings"><GearIcon />Settings</Link></li> }
                    <li className={ pathname === "/about" ? "active" : "" }><Link to="/about"><InfoIcon />About</Link></li>
                </ul>
                {
                    user && (
                        <>
                            <div className="section-divider">Playlists</div>
                            {
                                user.premium && (
                                    <div className="search-input">
                                        <Input
                                            onChange={ setPlaylistImportInputValue }
                                            value={ playlistUrl }
                                            disabled={ isImportPlaylistLoading }
                                            onEnter={ onPlaylistImport }
                                            icon={ isImportPlaylistLoading ? <LoaderIcon /> : <PlusIcon onClick={ onPlaylistImport } /> }
                                            placeholder="Import youtube playlist by url"
                                        />
                                    </div>
                                )
                            }
                            <ul className="links">
                                {
                                    playlists.map(({ _id, name }: Playlist) => (
                                        <li title={ name } style={{ whiteSpace : "nowrap" }} className={ pathname === `/playlist/${_id}` ? "active" : "" } key={ _id }>
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
            <div onClick={ () => setIsVisible(false) } className={ `sidenav-backdrop${isVisible ? " visible" : ""}` } />
        </>
    );
}

export default withRouter(Sidenav);