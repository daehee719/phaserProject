import 'phaser'

export default class PlayerSprite extends Phaser.Physics.Arcade.Sprite
{
    mainScene : Phaser.Scene;
    constructor(scene : Phaser.Scene,x:number,y:number,key:string)
    {
        super(scene,x,y,key);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.mainScene = scene;
    }
}