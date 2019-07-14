import * as React from "react";

const SendIcon: React.FunctionComponent<IconProps> = ({ onClick }) => {
    return (
        <svg className="icon" onClick={ onClick } version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 535.5 535.5" xmlSpace="preserve">
            <g>
                <g>
                    <polygon points="0,497.25 535.5,267.75 0,38.25 0,216.75 382.5,267.75 0,318.75"/>
                </g>
            </g>
        </svg>

    );
};

SendIcon.defaultProps = {
    onClick() { }
};

export default SendIcon;