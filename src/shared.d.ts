type Message = {
    message : string;
    date    : number;
    by      : {
        _id     : string;
        name    : string;
        picture : string;
    }
};

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