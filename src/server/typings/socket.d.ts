type SocketType = "GUEST" | "USER";
type SocketData = {
    id?            : string,
    type           : SocketType,
    currentRoomId? : string
};