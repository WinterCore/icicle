type PlayerDataUser = {
    name : string;
    _id  : string;
};

type PlayerData = {
    title         : string;
    url           : string;
    duration      : number;
    startAt       : number;
    videoId       : string;
    liveListeners : number;
    by            : PlayerDataUser
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