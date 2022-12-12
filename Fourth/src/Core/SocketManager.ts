import { Socket } from "socket.io-client";
import { addClientGameListener, addClientLobbyListener } from "../Network/ClientListener";
import LobbyScene from "../Scenes/LobbyScene";
import PlayGameScene from "../Scenes/PlayGameScene";

export default class SocketManager
{
    static Instance: SocketManager;
    socket:Socket;
    name:string;

    constructor(socket: Socket)
    {
        this.socket = socket;
    }
    setName(value:string):void
    {
        this.name = value;
    }
    addGameProtocol(scene:PlayGameScene):void{
        addClientGameListener(this.socket, scene);
    }
    addLobbyProtocol(scene:LobbyScene):void
    {
        addClientLobbyListener(this.socket,scene);
    }
    sendData(protocol:string, data:object):void
    {
        this.socket.emit(protocol, data);
    }
}