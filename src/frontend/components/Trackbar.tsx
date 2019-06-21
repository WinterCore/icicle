import * as React from "react";


const Trackbar: React.FunctionComponent<TrackbarProps> = (props) => {
    const { percentage, onSeek, seekable } = props;

    const handleSeek = ({ clientX, target }) => {
        console.log(target, clientX);
        if (seekable) {
            const { x, width } = target.getBoundingClientRect();
            onSeek((clientX - x) / width)
        }
    };

    return (
        <div className="trackbar" onClick={ handleSeek } style={{ cursor : "pointer" }}>
            <div className="trackbar-background" />
            <div className="trackbar-progress" style={{ width : `${percentage}%` }} />
        </div >
    );
};


interface TrackbarProps {
    percentage : number
    seekable   : boolean

    onSeek(current: number): void
}

export default Trackbar;