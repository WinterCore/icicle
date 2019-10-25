import RoomStore from "../room-store";
import { updateListenersCount } from "../helpers";


export default async function leave(socket: IcicleSocket) {
    const { id, currentRoomId } = socket.user;
    if (!currentRoomId) {
        return;
    }

    if (id) {
        RoomStore.removeListener(currentRoomId, id);
    }

    socket.leave(currentRoomId);
    updateListenersCount(currentRoomId);
    delete socket.user.currentRoomId;
}