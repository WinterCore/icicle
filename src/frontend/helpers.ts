const prefix = (n: number): string => n > 9 ? `${n}` : `0${n}`;
export const secondsToTime = (s: number) => {
    const hours   = Math.floor(s / 60 / 60);
    const minutes = Math.floor(s / 60) % 60;
    const seconds = s % 60;
    return `${hours ? hours + ":" : ""}${prefix(minutes)}:${prefix(seconds)}`; 
};