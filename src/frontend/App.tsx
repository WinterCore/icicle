import * as React                         from "react";
import { Route, BrowserRouter, Redirect } from "react-router-dom";
import { RouteChildrenProps }             from "react-router";
import { hot }                            from "react-hot-loader/root";

import AppProviders from "./contexts";

import Sidenav      from "./partials/Sidenav";
import Search       from "./routes/Search"; 
import People       from "./routes/People";
import Home         from "./routes/Home";
import ConfirmLogin from "./routes/ConfirmLogin";
import Playlist     from "./routes/Playlist";
import About        from "./routes/About";
import Invite       from "./routes/Invite";
import Settings     from "./routes/Settings";

import Player        from "./components/Player";
import Notification  from "./components/Notification";
import PlaylistModal from "./components/PlaylistModal";

import "./styles/main.styl";

import { useUser } from "./contexts/user";

interface AuthenticatedProps extends RouteChildrenProps {
    component : any
}
const Authenticated: React.FC<AuthenticatedProps> = ({ component: Component, ...props }) => {
    const { user } = useUser();
    if (!user) return <Redirect to="/home" />
    return <Component { ...props } />
};

function App() {
    React.useEffect(() => {
        const $root: HTMLDivElement   = document.querySelector("#root") as HTMLDivElement;
        const $loader: HTMLDivElement = document.querySelector("#loader") as HTMLDivElement;
        $loader.classList.add("loaded");
        $root.classList.add("loaded");
        setTimeout(() => {
            $root.style.transform = "none";
            $loader.style.display = "none";
        }, 300);
    }, []);
    return (
        <BrowserRouter>
            <AppProviders>
                    <Sidenav />
                    <section className="main">
                        <Route exact path="/" component={ Home } />
                        <Route path="/search" component={ Search } />
                        <Route path="/people" component={ People } />
                        <Route path="/about" component={ About } />
                        <Route path="/settings" render={ (props) => <Authenticated { ...props } component={ Settings } /> } />
                        <Route path="/invite/:token" component={ Invite } />
                        <Route path="/auth/google/callback" component={ ConfirmLogin } />
                        <Route path="/playlist/:id" render={ (props) => <Authenticated { ...props } component={ Playlist } /> } />
                    </section>
                    <Player />
                    <Notification />
                    <PlaylistModal />
            </AppProviders>
        </BrowserRouter>
    );
}

export default hot(App);