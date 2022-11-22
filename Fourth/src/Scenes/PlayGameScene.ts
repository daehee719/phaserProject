import Phaser from "phaser";
import MapManager from "../Core/MapManager";
import Player from "../GameObjects/Player";
import {GameOption} from "../GameOption";
import {io, Socket} from "socket.io-client"
import { Position } from "../Network/Protocol";
import { addClientListener } from "../Network/ClientListener";

interface RemotePlayerList 
{
    [key:string]: Player
}

export default class PlayGameScene extends Phaser.Scene
{
    player: Player;

    socket:Socket; //접속 소켓
    playerName:string; //나중에 입력창을 통해 받는다.

    remotePlayers:RemotePlayerList = {}; //원격 플레이어들을 저장한다.

    constructor()
    {
        super({key:"PlayGame"});   
        this.socket = io();        
    }

    create():void 
    {
        MapManager.Instance = new MapManager(this, "level1");
        addClientListener(this.socket, this);

        this.playerName = "gondr";
        this.socket.emit("enter", {name:this.playerName});
    }

    onCompleteConnection(x:number, y:number): void 
    {
        this.createPlayer(x, y, 200, 350, this.socket.id, false); //플레이어 생성, 스피드 200, 점프 350
        this.cameraSetting(); //카메라 셋팅 호출
    }

    //원격으로 진행하는 플레이어랑, 내가 조종하는 플레이어 구분을 해줘야 한다.
    createPlayer(x:number, y:number, speed:number, jumpPower:number, id:string, isRemote:boolean) : void
    {
        if(isRemote)
        {
            //원격 플레이어 생성해주고
            this.remotePlayers[id] = new Player(this, x, y, "player", speed, jumpPower, id, isRemote);
        }else {
            this.player = new Player(this, x, y, "player", speed, jumpPower, id, isRemote);
            this.physics.add.collider(this.player, MapManager.Instance.collisions);
        }
    }

    //리모트 플레이어 제거
    removePlayer(key:string):void 
    {
        this.remotePlayers[key].destroy(); //게임오브젝트를 destroy
        delete this.remotePlayers[key]; //딕셔너리에서 삭제
    }

    cameraSetting(): void 
    {
        const {width, height,mapOffset, cameraZoomFactor, bottomOffset} = GameOption;
        this.physics.world.setBounds(0, 0, width + mapOffset, height + bottomOffset);
        this.cameras.main.setBounds(0, 0, width + mapOffset, height);
        this.cameras.main.setZoom(cameraZoomFactor);
        this.cameras.main.startFollow(this.player);
    }
}