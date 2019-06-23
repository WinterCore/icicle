import * as React from "react";


import Volume   from "../icons/Volume";

const VolumeRocker: React.FunctionComponent<VolumeRockerProps> = ({ onVolumeChange, volume }) => {
    const [isVisible, setIsVisible] = React.useState();
    const volumeRockerRef = React.useRef<HTMLDivElement>(null);

    const {
        handleMouseEnter,
        handleMouseLeave,
        handleMouseDown,
        handleClick,
        removeMouseMoveListener
    } = React.useMemo(() => {

        let hideTimeout: NodeJS.Timeout;
        const handleMouseEnter = () => {
            setIsVisible(true)
            clearTimeout(hideTimeout);
        };
        const handleMouseLeave = () => {
            hideTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 1500);
        };

        const handleMouseDown = () => window.addEventListener("mousemove", handleMouseDownMovement);
        const removeMouseMoveListener = () => window.removeEventListener("mousemove", handleMouseDownMovement);
        const handleClick = ({ clientY }) => {
            const { top, height } = volumeRockerRef.current.getBoundingClientRect();
            const volume = Math.min(1, 1 - ((clientY - top) / height));
            onVolumeChange(volume < 0.01 ? 0 : volume);
        };


        const handleMouseDownMovement = ({ clientY }) => {
            const { top, height } = volumeRockerRef.current.getBoundingClientRect();
            const volume = Math.min(1, 1 - ((clientY - top) / height));
            onVolumeChange(volume < 0.01 ? 0 : volume);
        };
        return {
            handleMouseEnter,
            handleMouseLeave,
            handleClick,
            handleMouseDown,
            removeMouseMoveListener
        };
    }, []);



    
    React.useEffect(() => {
        window.addEventListener("mouseup", removeMouseMoveListener);
        return () => {
            window.removeEventListener("mouseup", removeMouseMoveListener);
        };
    });

    return (
        <>
            <div onMouseEnter={ handleMouseEnter } onMouseLeave={ handleMouseLeave } className={`volume-bar-outer${isVisible ? " visible" : ""}`}>
                <div onMouseDown={ handleMouseDown } onClick={ handleClick } className="volume-track-outer" ref={ volumeRockerRef }>
                    <div className="volume-track" style={{ height : `${volume * 100}%` }}></div>
                </div>
            </div>
            <div onMouseEnter={ handleMouseEnter } onMouseLeave={ handleMouseLeave }>
                <Volume />
            </div>
        </>
    );
};

interface VolumeRockerProps {
    volume: number;

    onVolumeChange(percentage: number): void;
}

export default VolumeRocker;