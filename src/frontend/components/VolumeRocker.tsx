import * as React from "react";


import Volume   from "../icons/Volume";

const VolumeRocker: React.FunctionComponent<VolumeRockerProps> = ({ onVolumeChange }) => {
    const [isVisible, setIsVisible] = React.useState<boolean>(false);
    const [volume, setVolume]       = React.useState<number>(() => {
        const val = window.localStorage.getItem("volume");
        return val ? +val : 0.3;
    });
    const volumeRockerRef = React.useRef<HTMLDivElement>(null);

    const {
        handleMouseEnter,
        handleMouseLeave,
        handleMouseDown,
        handleClick,
        removeMouseMoveListener,
        handleTouchStart
    } = React.useMemo(() => {

        let hideTimeout: number;

        const handleVolumeChange = (vol: number) => {
            setVolume(vol);
            onVolumeChange(vol);
        };

        const handleMouseEnter = () => {
            setIsVisible(true)
            clearTimeout(hideTimeout);
        };
        const handleMouseLeave = () => {
            hideTimeout = window.setTimeout(() => {
                setIsVisible(false);
            }, 1500);
        };

        const handleMouseDown = () => {
            window.addEventListener("mousemove", handleMouseDownMovement);
        };

        const handleTouchStart = () => {
            window.addEventListener("touchmove", handleTouchStartMovement);
        };
        const removeMouseMoveListener = () => {
            window.removeEventListener("mousemove", handleMouseDownMovement)
            window.removeEventListener("touchmove", handleTouchStartMovement)
        };
        const handleClick = ({ clientY }: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            const { top, height } = volumeRockerRef.current!.getBoundingClientRect();
            // TODO: calculate the exact position of the mouse on the knob
            const volume = Math.min(1, 1 - ((clientY - top) / height));
            handleVolumeChange(volume < 0.01 ? 0 : volume);
        };

        const handleMouseDownMovement = (evt: MouseEvent) => {
            evt.preventDefault();
            const { top, height } = volumeRockerRef.current!.getBoundingClientRect();
            const volume = Math.min(1, 1 - ((evt.clientY - top) / height));
            handleVolumeChange(volume < 0.01 ? 0 : volume);
        };
        const handleTouchStartMovement = (evt: TouchEvent) => {
            evt.preventDefault();
            const { top, height } = volumeRockerRef.current!.getBoundingClientRect();
            const volume = Math.min(1, 1 - ((evt.touches[0].clientY - top) / height));
            handleVolumeChange(volume < 0.01 ? 0 : volume);
        };
        return {
            handleMouseEnter,
            handleMouseLeave,
            handleClick,
            handleMouseDown,
            handleTouchStart,
            removeMouseMoveListener
        };
    }, []);


    const toggleVisibility = () => setIsVisible(!isVisible);
    
    React.useEffect(() => {
        window.addEventListener("mouseup", removeMouseMoveListener);
        window.addEventListener("touchend", removeMouseMoveListener);
        return () => {
            removeMouseMoveListener();
        };
    }, []);

    return (
        <>
            <div onMouseEnter={ handleMouseEnter } onMouseLeave={ handleMouseLeave } className={`volume-bar-outer${isVisible ? " visible" : ""}`}>
                <div
                    onMouseDown={ handleMouseDown }
                    onTouchStart={ handleTouchStart }
                    onClick={ handleClick }
                    className="volume-track-outer"
                    ref={ volumeRockerRef }
                >
                    <div className="volume-track" style={{ height : `${volume * 100}%` }}></div>
                </div>
            </div>
            <div style={{ display : "flex", alignItems : "center" }} onClick={ toggleVisibility } onMouseEnter={ handleMouseEnter } onMouseLeave={ handleMouseLeave }>
                <Volume />
            </div>
        </>
    );
};

interface VolumeRockerProps {
    onVolumeChange(percentage: number): void;
}

export default VolumeRocker;