import { Socket } from "socket.io";
import RoomManager from "../Server/RoomManager";
import ServerMapManager from "../Server/ServerMapManager";
import Session, { SessionStatus, SessionTeam } from "../Server/Session";
import SessionManager from "../Server/SessionManager";
import { ChangeTeam, CreateRoom, DeadInfo, EnterRoom, HitInfo, iceball, MsgBox, ReviveInfo, SessionInfo, UserInfo } from "./Protocol";

//서버쪽 소켓이 리스닝해야하는 이벤트를 여기서 다 등록한다.
export const addServerListener = (socket: Socket, session:Session) => {
    socket.on("login_user",data=>
    {
        if(session.status == SessionStatus.CONNECTED)   
        {
            let userInfo = data as UserInfo;
            session.setName(userInfo.name);
            session.status = SessionStatus.LOBBY;
            socket.emit("login_confirm", userInfo);
        }
    })

    socket.on("room_list",data=>
    {
        socket.emit("room_list",RoomManager.Instance.getAllRoomInfo())
    })

    socket.on("create_room",data=>
    {
        let {name, playerId} = data as CreateRoom;
        
        let room = RoomManager.Instance.createRoom(name);
        room.ownerID = playerId;
        room.enterRoom(session);

        socket.emit("enter_room",room.serialize());
    })

    socket.on("enter_room",data=>
    {
        let enterRoom = data as EnterRoom;
        let room = RoomManager.Instance.getRoom(enterRoom.roomNo);
        let msg: MsgBox = {msg:"존재하지 않는 방입니다."};
        if(room == null)
        {
            socket.emit("msgbox",{msg})
        }
        else
        {
            let result = room.enterRoom(session);
            if(result == false)
            {
                msg.msg = "더 이상 방에 자리가 없습니다.";
                socket.emit("msgbox",msg);   
            }
            else
            {
                let newUser:UserInfo ={name:session.name, playerId:session.id};
                room.broadcast("new_user",newUser,session.id,true);
                socket.emit("enter_room",room.serialize());
            }
        }
    })

    socket.on("request_team", data=>
    {
        let changeTeam = data as ChangeTeam;
        if(session.status != SessionStatus.INROOM)
        {
            socket.emit("msgbox",{msg:"올바르지 않은 접근입니다."});
        }

        session.team = changeTeam.team;
        session.room?.broadcast("confirm_team",changeTeam,"none");
    })

    socket.on("enter", data => {
        let pos = ServerMapManager.Instance.getRandomSpawnPosition();
        socket.emit("position", pos);
        session.setName(data.name);
        session.setPosition(pos);
        
        //접속한 소켓에게는 init_player_list 메시지를 보낼거고
        let list = SessionManager.Instance.getAllSessionInfo();
        session.send("init_player_list", {list});        
        
        //다른 모든 소켓에게는 enter_player, SessionInfo와 함께 보낼꺼다
        //지금 들어온 소켓은 안받을 거다.
        SessionManager.Instance.broadcast("enter_player", session.getSessionInfo(), socket.id, true);
    });

    

    socket.on("info_sync", data=>
    {
        let info = data as SessionInfo;
        SessionManager.Instance.getSession(info.id)?.setInfo(info);
    })
    let projectileId:number = 0;
    socket.on("fire_attempt",data=>
    {
        let iceball = data as iceball;
        projectileId++;
        iceball.projectileId = projectileId;
        SessionManager.Instance.broadcast("fire_projectile",iceball, socket.id, false);
    })
    socket.on("disconnect", (reason:string) => {
        SessionManager.Instance.removeSession(socket.id);
        console.log(`${session.name} ( ${socket.id} ) is disconnected`);

        //여기서 접속한 모든 사용자에게 해당 유저가 떠났음을 알려줘야 한다.
        if(session.room != null)
        {
            session.room.broadcast("leave_player", session.getSessionInfo(),socket.id, true);
        }
        //SessionManager.Instance.broadcast("leave_player", session.getSessionInfo(), socket.id, true);
    });
    socket.on("hit_report",data=>
    {
        let hitInfo = data as HitInfo;
        let session = SessionManager.Instance.getSession(hitInfo.playerId);
        if(session == undefined) return;
        let {x,y} = session.position;
        let sLTPos = {x: x-32, y:y-38};
        let iLTPos = hitInfo.projectileLTPosition;

        let verify:boolean = (sLTPos.x<iLTPos.x+20)
                            && (sLTPos.y<iLTPos.y+20)
                            && (sLTPos.x+32+32*0.5>iLTPos.x)
                            && (sLTPos.x+38+38*0.5>iLTPos.y);
        if(verify == false) return;
        SessionManager.Instance.broadcast("hit_confirm",hitInfo, socket.id, false);  
    })
    socket.on("player_dead",data=>
    {
        let deadInfo = data as DeadInfo;
        SessionManager.Instance.broadcast("player_dead",deadInfo, socket.id, true);
        setTimeout(() => {
            //부활 브로드캐스팅
            let pos = ServerMapManager.Instance.getRandomSpawnPosition();
            session.setPosition(pos);

            let reviveInfo : ReviveInfo = {playerId: deadInfo.playerId, info:session.getSessionInfo()};
            SessionManager.Instance.broadcast("player_revive", reviveInfo, socket.id, false);
        }, 1000*5);
    })
    
    
};