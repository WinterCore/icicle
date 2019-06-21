import * as React               from "react";
import { Route, BrowserRouter } from "react-router-dom";
import { hot }                  from "react-hot-loader/root";

import AppProviders from "./contexts";

import Sidenav      from "./partials/Sidenav";
import Search       from "./routes/Search"; 
import People       from "./routes/People";
import ConfirmLogin from "./routes/ConfirmLogin";

import Player from "./components/Player";

import "./styles/main.styl";

function App() {
    return (
        <BrowserRouter>
            <AppProviders>
                    <Sidenav />
                    <section className="main">
                        <Route path="/search" component={ Search } />
                        <Route path="/people" component={ People } />
                        <Route path="/auth/google/callback" component={ ConfirmLogin } />
                    </section>
                    <Player />
            </AppProviders>
        </BrowserRouter>
    );
}

export default hot(App);