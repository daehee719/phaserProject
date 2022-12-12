import { SessionInfo } from "../Network/Protocol";
import RoomManager from "./RoomManager";
import Session from "./Session";

export interface SessionMap
{
    [key:string] : Session
}

export default class SessionManager 
{
    static Instance : SessionManager;
    map:SessionMap = {}; //비어있는 세션맵을 하나만든다.

    constructor() {

    }

    getSession(key:string): Session | undefined {
        return this.map[key];
    }

    addSession(key:string, session:Session): void 
    {
        this.map[key] = session;
    }

    removeSession(key:string): void
    {
        let s = this.map[key];
        delete this.map[key];
        if(s.room != null)
            RoomManager.Instance.leaveRoom(s);
    }

    broadcast(protocol:string, msgJson:Object, senderKey:string, exceptSender:boolean = false): void
    {
        //for in은 오브젝트의 키를 순회한다
        for(let key in this.map)
        {
            if(key == senderKey && exceptSender == true) continue;
            this.map[key].send(protocol, msgJson); //자기자신이 아닌경우 보낸다.
        }
    }

    //모든 세션의 정보를 가져온다.
    getAllSessionInfo() : SessionInfo[] 
    {
        let list:SessionInfo[] = [];
        //이부분은 니네가 작성해야 한다.
        for(let key in this.map)
        {
            list.push(this.map[key].getSessionInfo());
        }
        return list;
    }
}