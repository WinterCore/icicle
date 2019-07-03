import * as React from "react";

const CrossIcon: React.FunctionComponent<IconProps> = ({ onClick }) => {
    return (
        <svg onClick={ onClick } className="icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 503.021 503.021" xmlSpace="preserve">
            <g>
                <g>
                    <path d="M491.613,75.643l-64.235-64.235c-15.202-15.202-39.854-15.202-55.056,0L251.507,132.222L130.686,11.407
                        c-15.202-15.202-39.853-15.202-55.055,0L11.401,75.643c-15.202,15.202-15.202,39.854,0,55.056l120.821,120.815L11.401,372.328
                        c-15.202,15.202-15.202,39.854,0,55.056l64.235,64.229c15.202,15.202,39.854,15.202,55.056,0l120.815-120.814l120.822,120.814
                        c15.202,15.202,39.854,15.202,55.056,0l64.235-64.229c15.202-15.202,15.202-39.854,0-55.056L370.793,251.514l120.82-120.815
                        C506.815,115.49,506.815,90.845,491.613,75.643z"/>
                </g>
            </g>
        </svg>
    );
};

CrossIcon.defaultProps = {
    onClick() { }
};

export default CrossIcon;