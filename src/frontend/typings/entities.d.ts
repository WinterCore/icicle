
declare namespace Entities {
    export interface User {
        _id        : string;
        name       : string;
        googleId   : string;
        picture    : string;
        email      : string;
        token      : string;
        settings   : {
            invisMode : boolean;
        };
    }
    export interface Song {
        _id       : string;
        title     : string;
        videoId   : string;
        thumbnail : string;
        duration  : number;
    };
}