import * as React from "react";



const TextRoller: React.FunctionComponent<TextRollerProps> = ({ children, speed, uid }) => {
    const containerRef    = React.useRef<HTMLDivElement>(null);
    const itemRef         = React.useRef<HTMLDivElement>(null);
    const [left, setLeft] = React.useState(0);

    React.useLayoutEffect(() => {
        let textWidth, containerWidth, tempLeft, tracker;
        const loop = () => {
            if (textWidth + tempLeft < 0) setLeft(containerWidth);
            setLeft((left) => {
                tempLeft = left - speed;
                return left - speed;
            });
            tracker = window.requestAnimationFrame(loop);
        };
        
        const init = () => {
            window.cancelAnimationFrame(tracker);
            containerWidth = containerRef.current.getBoundingClientRect().width;
            textWidth      = itemRef.current.getBoundingClientRect().width;
            setLeft(0);
            if (textWidth > containerWidth) {
                tracker = window.requestAnimationFrame(loop);
            }
        };
        init();

        window.addEventListener("resize", init);
        
        return () => {
            window.cancelAnimationFrame(tracker);
            window.removeEventListener("resize", init);
        };     
    }, [uid]);

    return (
        <div className="textroller-outer" ref={ containerRef }>
            <div style={{ transform : `translateX(${left}px)` }} className="textroller-item" ref={ itemRef }>
                { children }
            </div>
        </div>
    );
};

interface TextRollerProps {
    children : React.ReactNode;
    uid     ?: string | number;
    speed   ?: number;
}

TextRoller.defaultProps = { speed : 0.4, uid : 1 };

export default TextRoller;