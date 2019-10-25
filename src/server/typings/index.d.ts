type JWTUser = {
    id : string;
};


type SearchParams = {
	q             : string;
	nextPageToken : string;
};

interface IcicleSocket extends SocketIO.Socket 
{
    user: {
        id?            : string;
        isProcessing   : boolean;
        currentRoomId? : string;
    }
}
