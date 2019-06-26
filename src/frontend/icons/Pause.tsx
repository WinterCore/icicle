
import * as React from "react";

const Pause: React.FunctionComponent<IconProps> = ({ onClick }) => {
    return (
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 70 70" xmlSpace="preserve" className="icon" onClick={ onClick }>
            <g>
                <g>
                    <g>
                        <path d="M52.5,0c-4.972,0-9,1.529-9,6.5v57c0,4.971,4.028,6.5,9,6.5c4.971,0,9-1.529,9-6.5v-57
                            C61.5,1.529,57.471,0,52.5,0z"/>
                        <path d="M17.5,0c-4.972,0-9,1.529-9,6.5v57c0,4.971,4.028,6.5,9,6.5c4.971,0,9-1.529,9-6.5v-57
                            C26.5,1.529,22.471,0,17.5,0z"/>
                    </g>
                </g>
            </g>
        </svg>
    );
}

export default Pause;