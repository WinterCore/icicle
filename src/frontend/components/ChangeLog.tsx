import * as React from "react";
import Button from "./Button";

const ChangeLog: React.FunctionComponent = () => {
    const [dismissed, setDismissed] = React.useState(!!window.localStorage.getItem("change-log-modal-dissmised"));
    const handleDismiss = () => {
        window.localStorage.setItem("change-log-modal-dissmised", "true");
        setDismissed(true);
    };

    if (dismissed)
        return null;

    return (
        <div className="change-log-modal">
            <div className="header"><h1>ICICLE</h1>&nbsp;&nbsp;&nbsp;<span className="washed-out">BETA</span></div>
            <div className="body">
                <ul>
                    <li>This app is still in development, so don't expect everything to work perfectly</li>
                    <li>Report bugs using the <a target="_blank" href="https://github.com/WinterCore/icicle">github repo</a></li>
                    <li>The skip button is currently not working</li>
                    <li>#noblame #suffer</li>
                    <li></li>
                    <li>
                        Made with Love,&nbsp;
                        <a href="https://nodejs.org/" target="_blank">Node</a>,&nbsp;
                        <a href="https://reactjs.org/" target="_blank">React</a>,&nbsp;
                        <a href="https://socket.io/" target="_blank">Socket.io</a>,&nbsp;and&nbsp;
                        <a href="https://socket.io/" target="_blank">Typescript</a>&nbsp;
                    </li>
                </ul>
                <Button onClick={ handleDismiss }>Close</Button>
            </div>
        </div>
    );
};

export default ChangeLog;