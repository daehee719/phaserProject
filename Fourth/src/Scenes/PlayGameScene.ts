import Phaser from "phaser";
import MapManager from "../Core/MapManager";
import Player from "../GameObjects/Player";
import {GameOption} from "../GameOption";
import {io, Socket} from "socket.io-client"


export default class PlayGameScene extends Phaser.Scene
{
    player: Player;

    socket:Socket; //접속 소켓

    constructor()
    {
        super({key:"PlayGame"});   
        this.socket = io();        
    }

    create():void 
    {
        MapManager.Instance = new MapManager(this, "level1");
        this.socket.on("position", data => {
            console.log(data);
            this.onCompleteConnection(data.x, data.y);
        });

        this.socket.emit("enter", {name:"gondr"});

    }

    onCompleteConnection(x:number, y:number): void 
    {
        this.createPlayer(x, y, 200, 350); //플레이어 생성, 스피드 200, 점프 350
        this.cameraSetting(); //카메라 셋팅 호출
    }

    createPlayer(x:number, y:number, speed:number, jumpPower:number) : void
    {
        this.player = new Player(this, x, y, "player", speed, jumpPower);
        this.physics.add.collider(this.player, MapManager.Instance.collisions);
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