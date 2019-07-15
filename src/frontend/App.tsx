import * as React               from "react";
import { Route, BrowserRouter } from "react-router-dom";
import { hot }                  from "react-hot-loader/root";

import AppProviders from "./contexts";

import Sidenav      from "./partials/Sidenav";
import Search       from "./routes/Search"; 
import People       from "./routes/People";
import Home         from "./routes/Home";
import ConfirmLogin from "./routes/ConfirmLogin";
import Playlist     from "./routes/Playlist";
import About        from "./routes/About";

import Player        from "./components/Player";
import ChangeLog     from "./components/ChangeLog";
import Notification  from "./components/Notification";
import PlaylistModal from "./components/PlaylistModal";

import "./styles/main.styl";

function App() {
    return (
        <BrowserRouter>
            <AppProviders>
                    <Sidenav />
                    <section className="main">
                        <Route exact path="/" component={ Home } />
                        <Route path="/search" component={ Search } />
                        <Route path="/people" component={ People } />
                        <Route path="/about" component={ About } />
                        <Route path="/auth/google/callback" component={ ConfirmLogin } />
                        <Route path="/playlist/:id" component={ Playlist } />
                    </section>
                    <Player />
                    <Notification />
                    <PlaylistModal />
            </AppProviders>
        </BrowserRouter>
    );
}

export default hot(App);