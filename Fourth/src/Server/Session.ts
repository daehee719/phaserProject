import {Socket} from "socket.io"
import { Position } from "../Network/Protocol";

export default class Session
{
    socket:Socket;
    name:string;
    id:string;
    position: Position;
    constructor(socket:Socket)
    {
        this.socket = socket;
        this.id = socket.id;
    }
    setPosition(position:Position):void{
        let {x,y} = position;
        this.position.x = x;
        this.position.y = y;
    }
    setName(value:string):void
    {
        this.name = value;
    }
    send(protocol:string, data:any):void
    {
        this.socket.emit(protocol, data);
    }
}