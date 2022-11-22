import { Socket } from "socket.io-client";
import { addClientListener } from "../Network/ClientListener";
import PlayGameScene from "../Scenes/PlayGameScene";

export default class SocketManager
{
    static Instance: SocketManager;
    socket:Socket;

    constructor(socket: Socket)
    {
        this.socket = socket;
    }
    addProtocol(scene:PlayGameScene):void{
        addClientListener(this.socket, scene);
    }
    sendData(protocol:string, data:object):void
    {
        this.socket.emit(protocol, data);
    }
}