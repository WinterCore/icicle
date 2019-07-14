type PlayerData = {
    title         : string;
    url           : string;
    duration      : number;
    startAt       : number;
    videoId       : string;
    liveListeners : number;
    by            : {
        name : string;
        _id  : string;
    }
};

interface Window {
    socket : SocketIOClient.Socket;
}

type QueueItem = {
    _id       : string;
    title     : string;
    videoId   : string;
    duration  : number;
    thumbnail : string;
}