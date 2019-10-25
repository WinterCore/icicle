import * as React from "react";

const TextRoller: React.FunctionComponent<TextRollerProps> = ({ children, speed = 0.4, uid = 1 }) => {
    const containerRef    = React.useRef<HTMLDivElement>(null);
    const itemRef         = React.useRef<HTMLDivElement>(null);

    React.useLayoutEffect(() => {
        let textWidth: number, containerWidth: number, tempLeft = 0, tracker: number = 0, cycle = 1;
        const loop = () => {
            if (tempLeft > 0 && tempLeft - speed < 0) {
                cycle += 1;
            }
            if (textWidth + tempLeft < 0) tempLeft = containerWidth;
            tempLeft -= speed;
            itemRef.current!.style.transform = `translateX(${tempLeft - speed}px)`;
            if (cycle === 2) {
                window.cancelAnimationFrame(tracker);
                tracker = 0;
                itemRef.current!.style.transform = `translateX(0px)`;
            } else {
                tracker = window.requestAnimationFrame(loop);
            }
        };
        
        const init = () => {
            if (tracker !== 0) {
                return;
            }
            cycle = 1;
            window.cancelAnimationFrame(tracker);
            containerWidth = containerRef.current!.getBoundingClientRect().width;
            textWidth      = itemRef.current!.getBoundingClientRect().width;
            tempLeft = 0;
            itemRef.current!.style.transform = "translateX(0px)";
            if (textWidth > containerWidth) {
                tracker = window.requestAnimationFrame(loop);
            }
        };

        containerRef.current!.addEventListener("mousemove", init);
        
        return () => {
            window.cancelAnimationFrame(tracker);
            containerRef.current!.removeEventListener("mousemove", init);
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

export default TextRoller;