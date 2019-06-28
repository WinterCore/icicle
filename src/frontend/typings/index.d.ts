type PlayerData = {
    title    : string;
    url      : string;
    duration : number;
    startAt  : number;
    by       : {
        name : string;
        _id  : string;
    }
};

interface Window {
    socket : SocketIOClient.Socket;
}