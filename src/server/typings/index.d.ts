import {Socket} from "socket.io";

type JWTUser = {
    id : string;
};


type SearchParams = {
	q             : string;
	nextPageToken ?: string;
};

interface IcicleSocket extends Socket 
{
    user: {
        id?            : string;
        isProcessing   : boolean;
        currentRoomId? : string;
    }
}
