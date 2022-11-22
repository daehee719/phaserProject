import {Socket} from 'socket.io'
import { Position, SessionInfo } from '../Network/Protocol';

export default class Session 
{
    socket:Socket;
    name:string;
    position:Position = {x:0, y:0};
    id:string;

    constructor(socket:Socket)
    {
        this.socket = socket;
        this.id = socket.id;
    }

    setPosition(position:Position):void 
    {   
        let {x, y} = position;
        this.position.x = x;        
        this.position.y = y;
    }
    setName(value:string):void{
        this.name = value;
    }

    send(protocol:string, data:any): void 
    {
        this.socket.emit(protocol, data);
    }

    getSessionInfo() : SessionInfo
    {
        return {id:this.id, name:this.name, position:this.position};
    }
}