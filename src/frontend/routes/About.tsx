import * as React             from "react";

import useApi from "../hooks/use-api";

import IcicleIcon from "../icons/Icicle";
import LoaderIcon from "../icons/Loader";

import Error      from "../components/Error";

import { GET_CHANGELOG } from "../api";

type Changelog = {
    version : string;
    changes : string[];
};


const About: React.FC = () => {
    const { data, isLoading, error } = useApi({ ...GET_CHANGELOG() });

    return (
        <div className="about-section">
            <div className="flex-middle">
                <a href="https://github.com/WinterCore/icicle" target="_blank"><IcicleIcon /></a>
            </div>

            <div className="by">
                <div style={{ textAlign : "center" }}>
                    <h1>Developed by <a target="_blank" href="https://www.wintercore.dev">WinterCore</a></h1>
                    <div>This app is still in development, so don't expect everything to work perfectly</div>
                    <div>The <a href="https://dribbble.com/shots/6619033-Music-player#" target="_blank">design</a> was inspired by <a target="_blank" href="https://dribbble.com/max_dobzhansky">Max Dobzhansky</a></div>
                    <div>Report bugs using the <a target="_blank" href="https://github.com/WinterCore/icicle">github repo</a></div>
                    <div>
                        <h2>Made with love and</h2>
                        <div className="made-with">
                            <a href="https://nodejs.org/" target="_blank"><img src="https://nodejs.org/static/images/logo.svg" title="Node" alt="Node" /></a>
                            <a href="https://reactjs.org/" target="_blank"><img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0xMS41IC0xMC4yMzE3NCAyMyAyMC40NjM0OCI+CiAgPHRpdGxlPlJlYWN0IExvZ288L3RpdGxlPgogIDxjaXJjbGUgY3g9IjAiIGN5PSIwIiByPSIyLjA1IiBmaWxsPSIjNjFkYWZiIi8+CiAgPGcgc3Ryb2tlPSIjNjFkYWZiIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIi8+CiAgICA8ZWxsaXBzZSByeD0iMTEiIHJ5PSI0LjIiIHRyYW5zZm9ybT0icm90YXRlKDYwKSIvPgogICAgPGVsbGlwc2Ugcng9IjExIiByeT0iNC4yIiB0cmFuc2Zvcm09InJvdGF0ZSgxMjApIi8+CiAgPC9nPgo8L3N2Zz4K" alt="React" title="React" /></a>
                            <a href="https://socket.io/" target="_blank"><img src="/assets/socket-io.png" alt="socket.io" title="socket.io" /></a>
                            <a href="https://www.typescriptlang.org/" target="_blank"><img src="/assets/typescript-logo.png" title="typescript" alt="typescript" /></a>
                        </div>
                    </div>
                </div>
                <br /><br />
                <h2>Change log</h2>
                {
                    error
                        ? <div className="flex-middle"><Error /></div>
                        : isLoading
                            ? <div className="flex-middle"><LoaderIcon /></div>
                            : (data.data as Changelog[]).map(({ version, changes }) => (
                                <div key={ version }>
                                    <h4>{ version }</h4>
                                    <ul className="change-log-version washed-out">
                                        { changes.map((change: string, i) => <li key={ i }>{ change }</li>) }
                                    </ul>
                                </div>
                            ))
                }
            </div>
        </div>
    );
};


export default About;
