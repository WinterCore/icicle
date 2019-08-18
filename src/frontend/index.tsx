import * as React        from "react";
import * as ReactDOM     from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

const Root = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

ReactDOM.render(
    <Root />,
    document.getElementById("root")
);

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js")
        .then(() => console.log("Service Worker registered successfully."))
        .catch(error => console.log("Service Worker registration failed:", error));
}