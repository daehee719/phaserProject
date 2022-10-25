import 'phaser'
import {GameOptions} from './Data/GameOption'
import Graphics = Phaser.GameObjects.Graphics;
import TileSprite = Phaser.GameObjects.TileSprite;

export default class PlatformSprite extends Phaser.GameObjects.RenderTexture
{
    body: Phaser.Physics.Arcade.Body;
    assignedVelocity:number = 0;
    cnaLandOnIt: boolean = false;
    isHeroOnIt:boolean = false;
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

    drawTexture(border : Graphics,pattern:TileSprite, eyes : Phaser.GameObjects.Sprite):void
    {
        border.clear();
        border.lineStyle(8,0x000,1);
        border.strokeRect(0,0,this.displayWidth,this.displayHeight);

        this.draw(pattern,this.displayWidth*0.5,Phaser.Math.Between(0,GameOptions.platformHeight));
        this.draw(eyes,this.displayWidth*0.5, this.displayHeight*0.5);
        this.draw(border);
    }

    transformTo(x:number,y:number,width:number,height:number)
    {
        this.x = x;
        this.y = y;
        this.setSize(width,height);
        this.body.setSize(width,height);
    }
}