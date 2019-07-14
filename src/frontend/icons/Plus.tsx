import * as React from "react";

const PlusIcon: React.FunctionComponent<IconProps> = ({ onClick }) => {
    return (
        <svg onClick={ onClick } className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" xmlSpace="preserve">
            <path d="M24 10h-10v-10h-4v10h-10v4h10v10h4v-10h10z"/>
        </svg>
    );
};

PlusIcon.defaultProps = {
    onClick() { }
};

export default PlusIcon;