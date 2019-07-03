import * as React               from "react";
import { Route, BrowserRouter } from "react-router-dom";
import { hot }                  from "react-hot-loader/root";

import AppProviders from "./contexts";

import Sidenav      from "./partials/Sidenav";
import Search       from "./routes/Search"; 
import People       from "./routes/People";
import Home         from "./routes/Home";
import ConfirmLogin from "./routes/ConfirmLogin";

import Player       from "./components/Player";
import ChangeLog    from "./components/ChangeLog";
import Notification from "./components/Notification";

import "./styles/main.styl";

function App() {
    return (
        <BrowserRouter>
            <AppProviders>
                    <ChangeLog />
                    <Sidenav />
                    <section className="main">
                        <Route exact path="/" component={ Home } />
                        <Route path="/search" component={ Search } />
                        <Route path="/people" component={ People } />
                        <Route path="/auth/google/callback" component={ ConfirmLogin } />
                    </section>
                    <Player />
                    <Notification />
            </AppProviders>
        </BrowserRouter>
    );
}

export default hot(App);