import { RoomInfo, UserInfo } from "../Network/Protocol";
import { RoomStatus } from "./RoomManager";
import Session, { SessionStatus } from "./Session";
import { SessionMap } from "./SessionManager";

export default class Room
{
    roomNo:number;
    sessionMap:SessionMap = {};
    status:RoomStatus = RoomStatus.IDLE;

    count:number = 0;
    maxCount:number = 4;
    name:string
    ownerID:string;

    constructor(name:string, roomNO:number)
    {
        this.roomNo = roomNO;
        this.name = name;
    }

    enterRoom(session:Session):boolean
    {
        if(this.count>=this.maxCount) return false;
        this.sessionMap[session.id] = session;
        session.setRoom(this);
        session.status = SessionStatus.INROOM;
        this.count++;
        return true;
    }

    leaveRoom(socketID:string):void
    {
        this.sessionMap[socketID].setRoom(null);
        this.sessionMap[socketID].status = SessionStatus.LOBBY;
        this.count--;
        delete this.sessionMap[socketID];
        if(socketID == this.ownerID)
        {
            console.log(`방장이 나갔습니다. ${this.roomNo}를 폐쇠합니다`);
            this.count=0;
            this.kickAllUser();
        }
    }
    kickAllUser():void
    {
        this.broadcast("leave-owner",{},"none");
        for(let key in this.sessionMap)
        {
            this.sessionMap[key].setRoom(null);
            this.sessionMap[key].status = SessionStatus.LOBBY;
        }

        this.sessionMap = {};
        this.count = 0;
    }

    broadcast(protocol:string, msg:object, sender:string, exceptSender:boolean = false)
    {
        for(let key in this.sessionMap)
        {
            if(key == sender && exceptSender) continue;
            this.sessionMap[key].send(protocol,msg);
        }
    }

    getUserList():UserInfo[]
    {
        let list : UserInfo[] = [];
        for(let key in this.sessionMap)
        {
            let s = this.sessionMap[key];
            list.push({name:s.name, playerId:s.id});
        }
        return list;
    }

    serialize():RoomInfo
    {
        let info:RoomInfo = {
            userList: this.getUserList(),
            name:this.name,
            userCnt:this.count,
            maxCnt : this.maxCount,
            isPlaying: this.status==RoomStatus.RUNNING,
            no : this.roomNo,
        }
        return info;
    }
}