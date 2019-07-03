import * as React from "react";

const NextIcon: React.FunctionComponent<IconProps> = ({ onClick }) => (
    <svg onClick={ onClick } version="1.1" className="icon" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 405.457 405.457" xmlSpace="preserve">
        <g>
            <path d="M64.147,331.322c0.078,4.985,2.163,9.911,5.688,13.438l55,55c3.599,3.601,8.659,5.697,13.75,5.697
                c5.091,0,10.151-2.096,13.75-5.697l183.281-183.282c3.601-3.599,5.697-8.659,5.697-13.75s-2.096-10.151-5.697-13.75L152.335,5.697
                C148.736,2.096,143.676,0,138.585,0c-5.091,0-10.151,2.096-13.75,5.697l-55,55c-3.591,3.598-5.681,8.651-5.681,13.734
                s2.09,10.136,5.681,13.734l114.562,114.563L69.835,317.291C66.171,320.958,64.07,326.139,64.147,331.322L64.147,331.322z"/>
        </g>
    </svg>
);

NextIcon.defaultProps = {
    onClick : () => null
};

export default NextIcon;