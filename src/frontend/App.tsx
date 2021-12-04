import * as React                         from "react";
import { Route, BrowserRouter, Navigate, Routes } from "react-router-dom";

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

const Authenticated: React.FC = ({ children }) => {
    const { user } = useUser();

    if (!user) return <Navigate to="/home" />

    return <>{children}</>;
};

function App() {
    if (!window.WebSocket) {
        const $message = document.querySelector("#loader h3") as HTMLDivElement;
        $message.innerHTML = "We're sorry, but your browser doesn't support websockets, you can't use this app";
        return null;
    }

    React.useEffect(() => {
        const $root   = document.querySelector("#root") as HTMLDivElement;
        const $loader = document.querySelector("#loader") as HTMLDivElement;
        $loader.classList.add("loaded");
        $root.classList.add("loaded");
        setTimeout(() => {
            $root.style.transform = "none";
            $loader.style.display = "none";
        }, 300);
    }, []);

    return (
        <AppProviders>
            <BrowserRouter>
                <Sidenav />
                <section className="main">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/search" element={ <Search /> } />
                        <Route path="/people" element={ <People /> } />
                        <Route path="/about" element={ <About /> } />
                        <Route path="/settings" element={ <Authenticated><Settings /></Authenticated> } />
                        <Route path="/invite/:token" element={ <Invite /> } />
                        <Route path="/auth/google/callback" element={ <ConfirmLogin /> } />
                        <Route path="/playlist/:id" element={<Authenticated><Playlist /></Authenticated>} />
                    </Routes>
                </section>
                <Player />
                <Notification />
                <PlaylistModal />
            </BrowserRouter>
        </AppProviders>
    );
}

export default App;
