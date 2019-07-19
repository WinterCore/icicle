

import * as React from "react";

const AddToPlaylistIcon: React.FunctionComponent<IconProps> = ({ onClick }) => {
    return (
        <svg className="icon" onClick={ onClick } version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 426.667 426.667" xmlSpace="preserve">
            <g>
                <rect x="0" y="64" width="256" height="42.667"/>
                <rect x="0" y="149.333" width="256" height="42.667"/>
                <rect x="0" y="234.667" width="170.667" height="42.667"/>
                <polygon points="341.333,234.667 341.333,149.333 298.667,149.333 298.667,234.667 213.333,234.667 213.333,277.333 
                    298.667,277.333 298.667,362.667 341.333,362.667 341.333,277.333 426.667,277.333 426.667,234.667"/>
            </g>
        </svg>
    );
};

AddToPlaylistIcon.defaultProps = {
    onClick() { }
};

export default AddToPlaylistIcon;