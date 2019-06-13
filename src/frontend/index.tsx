import * as React        from "react";
import * as ReactDOM     from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./app";

const Root = () => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);

ReactDOM.render(
    <Root />,
    document.getElementById("root")
);