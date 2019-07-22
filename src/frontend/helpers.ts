const prefix = (n: number): string => n > 9 ? `${n}` : `0${n}`;
export const secondsToTime = (s: number) => {
    const hours   = Math.floor(s / 60 / 60);
    const minutes = Math.floor(s / 60) % 60;
    const seconds = s % 60;
    return `${hours ? hours + ":" : ""}${prefix(minutes)}:${prefix(seconds)}`; 
};

export const randomRange = (min: number, max: number): number => {
    return Math.random() * (max - min) + min;
};

export const SHORTCUTS = {
    PLAY_PAUSE                   : "k,space",
    SKIP                         : "l",
    ADD_CURRENT_SONG_TO_PLAYLIST : "p",
    CLOSE                        : "esc"
};

function fallbackCopyTextToClipboard(text: string): Promise<void> {
    return new Promise((resolve, reject) => {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            const succeeded = document.execCommand("copy");
            document.body.removeChild(textArea);
            if (succeeded) resolve();
            else reject();
        } catch (err) {
            reject();
        }
    });
}
export const copyTextToClipboard = (text: string): Promise<void> => {
    if (!navigator.clipboard) {
        return fallbackCopyTextToClipboard(text);
    }
    return navigator.clipboard.writeText(text);
};