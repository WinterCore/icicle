import * as React from "react";


const Trackbar: React.FunctionComponent<TrackbarProps> = (props) => {
    const { percentage, onSeek, seekable } = props;
    const trackbarRef = React.useRef(null);

    const handleSeek = ({ clientX }) => {
        if (seekable) {
            const { left, width } = trackbarRef.current.getBoundingClientRect();
            onSeek((clientX - left) / width)
        }
    };

    return (
        <div className="trackbar" ref={ trackbarRef } onClick={ handleSeek } style={{ cursor : "pointer" }}>
            <div className="trackbar-background">
                <div className="trackbar-progress" style={{ width : `${percentage}%` }} />
            </div>
        </div >
    );
};


interface TrackbarProps {
    percentage : number;
    seekable   : boolean;

    onSeek ?: {(current: number): void};
}

export default Trackbar;