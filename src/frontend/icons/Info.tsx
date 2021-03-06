import * as React from "react";

const InfoIcon: React.FunctionComponent<IconProps> = ({ onClick }) => {
    return (
        <svg onClick={ onClick } className="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" enableBackground="new 0 0 24 24">
            <path d="M12,2C6.477,2,2,6.477,2,12c0,5.523,4.477,10,10,10c5.523,0,10-4.477,10-10C22,6.477,17.523,2,12,2z M13,17h-2v-6h2V17z M13,9h-2V7h2V9z"/>
        </svg>
    );
};

InfoIcon.defaultProps = {
    onClick() { }
};

export default InfoIcon;