

class Store {
    connections: Map<SocketIO.Socket, SocketData> = new Map();

    setSocketData(socket: SocketIO.Socket, data: SocketData) {
        this.connections.set(socket, data);
    }

    getSocketData(socket: SocketIO.Socket): SocketData {
        return this.connections.get(socket) as SocketData; // we're sure that all sockets exist on connections
    }

    deleteSocket(socket: SocketIO.Socket) {
        this.connections.delete(socket);
    }
}

export default new Store();