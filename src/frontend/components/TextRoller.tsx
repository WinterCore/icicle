import * as React from "react";



const TextRoller: React.FunctionComponent<TextRollerProps> = ({ children, speed, uid }) => {
    const containerRef    = React.useRef<HTMLDivElement>(null);
    const itemRef         = React.useRef<HTMLDivElement>(null);
    // const [left, setLeft] = React.useState(0);

    React.useLayoutEffect(() => {
        let textWidth, containerWidth, tempLeft = 0, tracker;
        const loop = () => {
            if (textWidth + tempLeft < 0) tempLeft = containerWidth
            tempLeft -= speed;
            itemRef.current.style.transform = `translateX(${tempLeft - speed}px)`;
            tracker = window.requestAnimationFrame(loop);
        };
        
        const init = () => {
            window.cancelAnimationFrame(tracker);
            containerWidth = containerRef.current.getBoundingClientRect().width;
            textWidth      = itemRef.current.getBoundingClientRect().width;
            tempLeft = 0;
            itemRef.current.style.transform = "translateX(0px)";
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
            <div className="textroller-item" ref={ itemRef }>
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