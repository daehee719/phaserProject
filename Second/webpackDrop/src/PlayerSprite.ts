import 'phaser'

export default class PlayerSprite extends Phaser.Physics.Arcade.Sprite
{
    mainScene : Phaser.Scene;
    isDie:boolean = false;
    canDestroyPlatform:boolean = false;
    
    constructor(scene : Phaser.Scene,x:number,y:number,key:string)
    {
        super(scene,x,y,key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.mainScene = scene;
    }

    die(multiplier : number):void
    {
        this.isDie = true;
        this.setVelocityY(-200);
        this.setVelocityX(200*multiplier);

        this.mainScene.tweens.add({
            targets:this,
            angle:45 * multiplier,
            duration:500
        })
    }
}