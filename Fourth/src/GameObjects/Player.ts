import Phaser from "phaser";
import InitPlayerAnimation from "../Animation/PlayerAnimation";
import { checkAnimationPlay } from "../Core/GameUtil";
import SocketManager from "../Core/SocketManager";
import { DeadInfo, SessionInfo } from "../Network/Protocol";
import HealthBar from "./HealthBar";
import PlayerAttack from "./PlayerAttack";
import ProjectilePool from "./Pools/ProjectilePool";

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

    attack:PlayerAttack;
    hasBeenHit:boolean = false;

    waitingConfirm:number[] = [];

    hp:number;
    maxHp:number;
    hpBar:HealthBar;
    isDead:boolean = false;

    tween:Phaser.Tweens.Tween;

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
        this.attack = new PlayerAttack(this,1000);
        this.maxHp = this.hp = 100;
        this.hpBar = new HealthBar(this.scene, {x:x -(32*0.5),y:y-(38*0.5)-18}, new Phaser.Math.Vector2(32,5));
        this.init();
    }

    isWaitingForHit(projectileId:number):boolean
    {
        return this.waitingConfirm.find(x => x == projectileId) != undefined;
    }

    addWaiting(projectileId:number):void
    {
        this.waitingConfirm.push(projectileId);
    }

    removeWaiting(projectileId:number):void
    {
        let idx = this.waitingConfirm.findIndex(x=>x == projectileId);
        if(idx<0) return;
        this.waitingConfirm.splice(idx,1);
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

    
    //왼쪽 오른쪽 방향만 direction으로 받는다.
    move(direction: number): void{
        this.setVelocityX(direction * this.speed);
    }

    fireIceball():void
    {
        this.attack.attemptAttack();
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
        if(checkAnimationPlay(this.anims, "throw")) return; 
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
    preUpdate(time: number, delta: number): void {
        super.preUpdate(time,delta);
        this.hpBar.move(this.x - (32*0.5), this.y-(38*0.5)-18);
    }
    update(time: number, delta: number): void 
    {
        
        if(this.hasBeenHit || this.isDead) return;
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
        if(checkAnimationPlay(this.anims, "throw")) return;

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

    takeHit(damage:number):void
    {
        if(this.hasBeenHit || this.isDead) return;
        this.hasBeenHit = true;
        this.hp -= damage;
        if(this.hp <=0)
        {
            this.hp = 0;
            this.setDead();
            return;
        }
        else
        {
            if(this.tween)
            {
                this.tween.stop(0);
            }
            this.tween = this.scene.tweens.add({
                targets:this,
                duration:200,
                repeat:-1,
                alpha:0.2,
                yoyo:true
            });
            this.scene.time.delayedCall(1000,()=>
            {
                this.hasBeenHit = false;
                this.tween.stop(0);
            })
        }
        this.hpBar.setHealth(this.hp/this.maxHp);
    }

    bounceOff(dir : Phaser.Math.Vector2):void
    {
        this.setVelocity(dir.x*200,dir.y*200);
    }

    setDead():void
    {
        this.hasBeenHit = false;
        this.setTint(0xff0000);
        this.body.checkCollision.none = true;
        this.isDead = true;
        if(this.isRemote == false)
        {            
            this.setVelocity(0,-200);
            this.scene.time.delayedCall(2000,()=>
            {
                this.setActive(false);
                this.setVisible(false);

                let info:DeadInfo = {playerId: this.id};
                SocketManager.Instance.sendData("player_dead", info);

            });
        }
        
    }

    revive():void
    {
        this.body.checkCollision.none = false;
    }
}