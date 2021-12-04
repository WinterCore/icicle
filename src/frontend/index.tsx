import * as React        from "react";
import * as ReactDOM     from "react-dom";

import App from "./App";

const Root = () => (
    <App />
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
