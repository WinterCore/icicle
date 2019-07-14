import * as React             from "react";
import { RouteChildrenProps } from "react-router";

import IcicleIcon from "../icons/Icicle";
import TextRoller from "../components/TextRoller";

const About: React.FunctionComponent<RouteChildrenProps> = ({ location }) => {
    return (
        <div className="about-section">
            <IcicleIcon  />
            <div className="by">
                <h1>Developed by <a target="_blank" href="https://www.wintercore.dev">WinterCore</a></h1>
                <ul>
                    <li>This app is still in development, so don't expect everything to work perfectly</li>
                    <li>Report bugs using the <a target="_blank" href="https://github.com/WinterCore/icicle">github repo</a></li>
                    <li>The skip button is currently not working</li>
                    <li>
                        Made with Love,&nbsp;
                        <a href="https://nodejs.org/" target="_blank">Node</a>,&nbsp;
                        <a href="https://reactjs.org/" target="_blank">React</a>,&nbsp;
                        <a href="https://socket.io/" target="_blank">Socket.io</a>,&nbsp;and&nbsp;
                        <a href="https://www.typescriptlang.org/" target="_blank">Typescript</a>&nbsp;
                    </li>
                </ul>
                <br /><br />
                <h2>Change log</h2>
                <h4>Version 0.2</h4>
                <ul className="change-log-version washed-out">
                    <li>The player's trackbar is now rainbow colored</li>
                    <li>Added room's chat section : Enjoy talking to other people listening with you, and trash talk all you want</li>
                    <li>Added playlists support : Now you can create/delete playlists, add/delete vidoes from playlists, add entire playlists to the queue</li>
                    <li>Added text roller : Overflowing text will now scroll in a nice elegant way <div style={{ width : 100 }}><TextRoller>Wooooo this is very cool</TextRoller></div></li>
                    <li>Search section : Make 4 videos appear per row instead of 3 on larger screens</li>
                    <li>Adding a video to the queue will start playing it immediately if you have nothing playing.</li>
                    <li>Added a nice pink background gradient for sidenav links which appears when they're active.</li>
                    <li>Styling improvements</li>
                    <li>Major bug fixes</li>
                </ul>
            </div>
        </div>
    );
};


export default About;