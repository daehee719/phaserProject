import { Socket } from "socket.io-client";
import PlayGameScene from "../Scenes/PlayGameScene";
import { PlayerList, Position, SessionInfo } from "./Protocol";

export const addClientListener = (socket:Socket, scene: PlayGameScene) => {
    socket.on("position", data => {
        let pos:Position = data as Position;
        scene.onCompleteConnection(pos.x, pos.y);
    });

    //다른 플레이어가 들어왔을때 알림
    socket.on("enter_player", data => {
        let info = data as SessionInfo; //타입 캐스팅
        scene.createPlayer(info.position.x, info.position.y, 200, 350, info.id, true);
    });

    //초기 접속시 플레이어 리스트 처리
    socket.on("init_player_list", data => {
        let playerList = data as PlayerList;
        playerList.list.forEach( (p:SessionInfo) => {
            if(p.id == socket.id) return; //자기자신은 추가하지 않는다.
            scene.createPlayer(p.position.x, p.position.y, 200, 350, p.id, true);
        });
    });

    //서버쪽에서 클라이언트가 disconnect되었을 때 
    // leave_player 라는 메시지와 함께 SessionInfo가 넘어오도록 만들어
    //그리고 그걸 받은 클라이언트는 removePlayer를 호출하게 하면돼.

    socket.on("leave_player", data => {
        let info = data as SessionInfo;
        scene.removePlayer(info.id);
    });
};