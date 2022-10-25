import 'phaser'
import {GameOptions} from './Data/GameOption'
import Graphics = Phaser.GameObjects.Graphics;
import TileSprite = Phaser.GameObjects.TileSprite;

export default class PlatformSprite extends Phaser.GameObjects.RenderTexture
{
    body: Phaser.Physics.Arcade.Body;
    constructor(scene:Phaser.Scene, x:number, y:number,width:number,height:number)
    {
        super(scene, x,y, width,height);
        this.setOrigin(0.5,0.5);
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }
    
    setPhysics():void
    {
        this.body.setImmovable(true);
        this.body.setAllowGravity(false);
    }

    drawTexture(border : Graphics,pattern:TileSprite):void
    {
        border.clear();
        border.lineStyle(8,0x000,1);
        border.strokeRect(0,0,this.displayWidth,this.displayHeight);

        this.draw(border);
    }
}