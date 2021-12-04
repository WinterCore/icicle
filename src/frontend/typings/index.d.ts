import {Socket} from "socket.io-client";

declare global {
    interface Window {
        socket : Socket;
    }
}

export type QueueItem = {
    _id       : string;
    title     : string;
    videoId   : string;
    duration  : number;
    thumbnail : string;
};



export type Playlist = {
    _id  : string;
    name : string;
};
