import * as React from "react";

const PreviousIcon: React.FunctionComponent<IconProps> = ({ onClick }) => (
    <svg version="1.1" onClick={ onClick } className="icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 405.456 405.456" xmlSpace="preserve">
        <g>
            <path d="M341.31,74.135c-0.078-4.985-2.163-9.911-5.688-13.438l-55-55C277.023,2.096,271.963,0,266.872,0
                s-10.151,2.096-13.75,5.697L69.841,188.978c-3.601,3.599-5.697,8.659-5.697,13.75s2.096,10.151,5.697,13.75l183.281,183.281
                c3.599,3.601,8.659,5.697,13.75,5.697s10.151-2.096,13.75-5.697l55-55c3.591-3.598,5.681-8.651,5.681-13.734
                s-2.09-10.136-5.681-13.734L221.06,202.728L335.622,88.166C339.287,84.499,341.387,79.318,341.31,74.135L341.31,74.135z"/>
        </g>
    </svg>
);

PreviousIcon.defaultProps = {
    onClick : () => null
};

export default PreviousIcon;