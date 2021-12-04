import {Socket} from "socket.io";


class Store {
    connections: Map<Socket, SocketData> = new Map();

    setSocketData(socket: Socket, data: SocketData) {
        this.connections.set(socket, data);
    }

    getSocketData(socket: Socket): SocketData {
        return this.connections.get(socket) as SocketData; // we're sure that all sockets exist on connections
    }

    deleteSocket(socket: Socket) {
        this.connections.delete(socket);
    }
}

export default new Store();
