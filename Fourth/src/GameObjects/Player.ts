import Phaser from "phaser";
import InitPlayerAnimation from "../Animation/PlayerAnimation";
import { SessionInfo } from "../Network/Protocol";

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    speed:number;
    jumpPower:number;
    cursorsKey: Phaser.Types.Input.Keyboard.CursorKeys;
    body: Phaser.Physics.Arcade.Body;

    //점프 관련된 변수들 선언
    isGround:boolean = false;
    maxJumpCount:number = 2;
    currentJumpCount:number = 0;

    //네트워크 관련 변수
    isRemote:boolean = false;
    id:string;

    constructor(scene: Phaser.Scene, x:number, y:number, 
        key:string, speed:number, jumpPower:number, id:string, isRemote:boolean)
    {
        super(scene, x, y, key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = speed;
        this.jumpPower = jumpPower;
        this.isRemote = isRemote;
        this.id = id;
        this.init();
    }

    init(): void 
    {
        this.setCollideWorldBounds(true); //월드 경계선과 충돌
        InitPlayerAnimation(this.scene.anims); //플레이어 애니메이션을 만들어주고

        if(this.isRemote == false){
            this.cursorsKey = this.scene.input.keyboard.createCursorKeys();
            this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
            this.scene.input.keyboard.on("keydown-Q",this.fireIceball,this);
        }else {
            //원격으로 움직이는 애들은 중력의 영향을 안받아야 해.
            this.body.setAllowGravity(false);
        }
    }

    fireIceball():void{
        console.log("발사");
    }
    //왼쪽 오른쪽 방향만 direction으로 받는다.
    move(direction: number): void{
        this.setVelocityX(direction * this.speed);
    }

    jump(): void {
        this.currentJumpCount++;
        if(this.isGround || this.currentJumpCount <= this.maxJumpCount)
        {
            this.setVelocityY(-this.jumpPower);
        }
    }

    setInfoSync(info:SessionInfo):void 
    {
        this.x = info.position.x;
        this.y = info.position.y;
        this.setFlipX(info.flipX);
        if(info.isMoveing)
        {
            this.play("run",true);
        }
        else
        {
            this.play("idle",true);
        }
    }
    isMoving():boolean
    {
        return this.body.velocity.length()>0.1;
    }
    update(time: number, delta: number): void 
    {
        if(this.cursorsKey == undefined) return;

        const {left, right, space} = this.cursorsKey;
        const isSpaceJustDown: boolean = Phaser.Input.Keyboard.JustDown(space);
        this.isGround = this.body.onFloor();

        if(left.isDown){
            this.move(-1);
            this.setFlipX(true);
        }else if(right.isDown)
        {
            this.move(1);
            this.setFlipX(false);
        }else {
            this.move(0);
        }

        if(isSpaceJustDown) {
            this.jump();
        }

        if(this.isGround && this.body.velocity.y == 0)
        {
            this.currentJumpCount = 0; //바닥에 닿으면 점프카운트 0으로 돌린다.
        }

        if(this.isGround == true)
        {
            if(Math.abs(this.body.velocity.x) <= 0.1)
            {
                this.play("idle", true);
            }else{
                this.play("run", true);
            }
        }else {
            this.play("jump", true);
        }
    }
}