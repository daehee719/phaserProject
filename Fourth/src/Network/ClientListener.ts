import { Socket } from "socket.io-client";
import ProjectilePool from "../GameObjects/Pools/ProjectilePool";
import PlayGameScene from "../Scenes/PlayGameScene";
import SessionManager from "../Server/SessionManager";
import { DeadInfo, HitInfo, iceball, PlayerList, Position, ReviveInfo, SessionInfo } from "./Protocol";

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

    socket.on("info_sync", data => {
        let pList = data as PlayerList;
        
        pList.list.forEach((p:SessionInfo) => {
            if(p.id == socket.id) return;
            scene.remotePlayers[p.id]?.setInfoSync(p);
        });
    });
    socket.on("fire_projectile", data=>
    {
        let iceball = data as iceball;
        if(iceball.ownerId == socket.id)
        {
            scene.player.attack.fireProjectile(iceball);
        }
        else
        {
            scene.remotePlayers[iceball.ownerId].attack.fireProjectile(iceball);
        }
    })

    socket.on("hit_confirm", data=>
    {
        let hitInfo = data as HitInfo;
        ProjectilePool.Instance.searchAndDisable(hitInfo.projectileId, hitInfo.projectileLTPosition);
        if(hitInfo.playerId == socket.id)
        {
            scene.player.removeWaiting(hitInfo.projectileId);
            let dir = hitInfo.projectileLTPosition.x - scene.player.x <0 ? 1:-1;
            scene.player.bounceOff(new Phaser.Math.Vector2(dir, -1));
            scene.player.takeHit(hitInfo.damage);
        }
        else
        {
            let target = scene.remotePlayers[hitInfo.playerId];
            if(target == undefined) return;
            target.removeWaiting(hitInfo.projectileId);
            target.takeHit(hitInfo.damage);
        }
    });
    socket.on("player_dead", data=>
    {
        let info = data as DeadInfo;
        scene.remotePlayers[info.playerId].setActive(false);
        scene.remotePlayers[info.playerId].setVisible(false);
    })

    socket.on("player_revive", data=>
    {
        let reviveInfo = data as ReviveInfo;
        console.log(`${reviveInfo.playerId} 님이 부활 했다.`)
    })
};