import * as React from "react";

const Play: React.FunctionComponent<IconProps> = ({ onClick }) => {
    return (
        <svg className="icon" onClick={ onClick } version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 124.512 124.512" xmlSpace="preserve">
            <g>
                <path d="M113.956,57.006l-97.4-56.2c-4-2.3-9,0.6-9,5.2v112.5c0,4.6,5,7.5,9,5.2l97.4-56.2
                    C117.956,65.105,117.956,59.306,113.956,57.006z"/>
            </g>
        </svg>
    );
}

export default Play;