import * as React from "react";

import { randomRange } from "../helpers";


const TILE_WIDTH = 5;
const MIN_HEIGHT = 5;
const MAX_HEIGHT = 30;
const MIN_HUE = 150;
const MAX_HUE = 200;

const generateTiles = (length: number): Tile[] => {
    return Array.from({ length }).map((_, i) => ({
        height : randomRange(MIN_HEIGHT, MAX_HEIGHT),
        color : {
            h : (i / length) * (MAX_HUE - MIN_HUE) + MIN_HUE,
            s : 90,
            l : 47
        }
    }));
};

type Tile = {
    height : number;
    color  : {
        h : number;
        s : number;
        l : number;
    };
};

const TrackbarV2: React.FunctionComponent<TrackbarV2Props> = (props) => {
    const { percentage, onSeek, seekable, uid } = props;
    const trackbarRef = React.useRef<HTMLDivElement>(null);
    const [tiles, setTiles] = React.useState<Tile[]>([]);

    const init = React.useMemo(() => () => {
        const { width } = trackbarRef.current.getBoundingClientRect();
        setTiles(generateTiles(Math.floor(width / TILE_WIDTH)));
    }, []);
    
    React.useEffect(() => { init(); }, [uid]);

    React.useEffect(() => {
        window.addEventListener("resize", init);
        return () => window.removeEventListener("resize", init);
    });

    const handleSeek = ({ clientX }) => {
        if (seekable) {
            const { left, width } = trackbarRef.current.getBoundingClientRect();
            onSeek((clientX - left) / width)
        }
    };

    const length = tiles.length;

    return (
        <div className="rainbow-trackbar" ref={ trackbarRef } onClick={ handleSeek } style={ seekable ? { cursor : "pointer" } : {}}>
            {
                tiles.map(({ height, color }, i) => {
                    const isActive = (i / length) < (percentage / 100);
                    return (
                        <div
                            className="rainbow-trackbar-tile"
                            style={{
                                height,
                                width : TILE_WIDTH,
                                background : isActive ? `hsl(${color.h}, ${color.s}%, ${color.l}%)` : "hsla(0, 100%, 100%, 0.4)",
                                boxShadow : isActive ? `0 0 14px hsla(${color.h}, ${color.s}%, ${color.l}%, 0.5)` : "none"
                            }}
                            key={ i }
                        />
                    );
                })
            }
        </div >
    );
};


interface TrackbarV2Props {
    percentage : number;
    seekable   : boolean;
    uid        : number | string;
    disabled  ?: boolean;
    onSeek    ?: {(current: number): void};
}

TrackbarV2.defaultProps = {
    disabled : false
};

export default TrackbarV2;