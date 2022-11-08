import GameUtil from "../Core/GameUtil";
import { GameOption } from "../GameOption";
import EnemyGroup from "./EnemyGroup";
import PlatformSprite from "./PlatformSprite";

export default class EnemySprite extends Phaser.Physics.Arcade.Sprite
{
    platform:PlatformSprite;
    body:Phaser.Physics.Arcade.Body;
    constructor(scene:Phaser.Scene, platform:PlatformSprite,group:EnemyGroup)
    {
        super(scene,platform.x,platform.y-100,'enemy'); 

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.initAnimation(this.scene.anims); //애니메이션 실행

        this.scale = GameOption.pixelScale;
        this.platform = platform;
        group.add(this);
        this.anims.play("enemy_run");
        this.setVelocityX(GameUtil.Rand(GameOption.patrolSpeed)*Phaser.Math.RND.sign());
    }

    patrol():void{
        this.setFlipX(this.body.velocity.x>0);

        let pBound = this.platform.getBounds();
        let eBound = this.getBounds();
        let xVelo = this.body.velocity.x;

        if((xVelo>0 && eBound.centerX>=pBound.right-20)
        ||(xVelo<0 && eBound.centerX<=pBound.left+20))
        {
            this.setVelocityX(xVelo*=-1);
        }
    }

    initAnimation(anim : Phaser.Animations.AnimationManager):void{
        anim.create({
            key:"enemy_hit",
            frames: anim.generateFrameNumbers("enemy_hit", {start:0, end:4}),
            frameRate:20,
            repeat:-1
        });

        anim.create({
            key:"enemy_run",
            frames: anim.generateFrameNumbers("enemy", {start:0, end:11}),
            frameRate:20,
            repeat:-1
        })
    }
}