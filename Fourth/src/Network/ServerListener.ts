import { Socket } from "socket.io";
import ServerMapManager from "../Server/ServerMapManager";
import Session from "../Server/Session";
import SessionManager from "../Server/SessionManager";
import { SessionInfo } from "./Protocol";

//서버쪽 소켓이 리스닝해야하는 이벤트를 여기서 다 등록한다.
export const addServerListener = (socket: Socket, session:Session) => {
    
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

    socket.on("disconnect", (reason:string) => {
        SessionManager.Instance.removeSession(socket.id);
        console.log(`${session.name} ( ${socket.id} ) is disconnected`);

        //여기서 접속한 모든 사용자에게 해당 유저가 떠났음을 알려줘야 한다.
        SessionManager.Instance.broadcast("leave_player", session.getSessionInfo(), socket.id, true);
    });
};