interface Window {
    socket : SocketIOClient.Socket;
}

type QueueItem = {
    _id       : string;
    title     : string;
    videoId   : string;
    duration  : number;
    thumbnail : string;
};



type Playlist = {
    _id  : string;
    name : string;
};