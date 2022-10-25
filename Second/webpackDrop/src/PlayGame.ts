import 'phaser'
import { GameOptions } from './Data/GameOption';
import PlayerSprite from './PlayerSprite'
import PlatformSprite from './PlatformSprite';
export class PlayGameScene extends Phaser.Scene {
    player: PlayerSprite;
    gameWidth : number;
    gameHeight : number;

    sky : Phaser.GameObjects.Sprite;
    eyes : Phaser.GameObjects.Sprite;
    borderGraphics: Phaser.GameObjects.Graphics;
    spritePattern : Phaser.GameObjects.TileSprite;

    platformGroup : Phaser.Physics.Arcade.Group;
    constructor()
    {
        super("PlayGame");
    }

    create():void{
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;
        this.addSky();
        this.eyes = this.add.sprite(0,0,'eyes');
        this.eyes.setVisible(false);

        this.borderGraphics = this.add.graphics();
        this.borderGraphics.setVisible(false);

        this.spritePattern = this.add.tileSprite(this.gameWidth*0.5, GameOptions.platformHeight*0.5,
            this.gameWidth, GameOptions.platformHeight*2,'pattern');

        this.spritePattern.setVisible(false);
        this.platformGroup = this.physics.add.group();
        for(let i:number = 0; i<12;i++)
        {
            this.addPlatform(i == 0);
        }
        this.addPlatform(true);
        this.player = new PlayerSprite(this,this.gameWidth*0.5,0,'hero');
    }

    addPlatform(isFirst : boolean):void
    {
        let p : PlatformSprite = new PlatformSprite(
            this,
            this.gameWidth*0.5,
            this.gameHeight * GameOptions.firstPlatformPosition,
            this.gameWidth / 8, GameOptions.platformHeight
            );
            this.platformGroup.add(p);
            p.setPhysics();
            p.drawTexture(this.borderGraphics,this.spritePattern,this.eyes); 

            if(isFirst)
            {
                p.setTint(0x0ff00);
                p.cnaLandOnIt = true;
            }
            else
            {
                this.initPlatform(p);
            }

        }

    addSky():void{
        this.sky = this.add.sprite(0,0,'sky');
        this.sky.displayWidth = this.gameWidth;
        this.sky.displayHeight = this.gameHeight;
        this.sky.setOrigin(0,0);
    }
    initPlatform(p: PlatformSprite):void
    {
        p.assignedVelocity = this.rand(GameOptions.xSpeedRange)*Phaser.Math.RND.sign();
        p.transformTo(this.gameWidth*0.5, 
            this.getLowestPlatformY() + this.rand(GameOptions.platformYDistanceRange),
            this.rand(GameOptions.platformLengthRange),GameOptions.platformHeight);
        p.drawTexture(this.borderGraphics, this.spritePattern,this.eyes);
    }

    getLowestPlatformY():number
    {
        return Phaser.Math.Between(0,1000);
    }

    rand(arr:number[])
    {
        return Phaser.Math.Between(arr[0],arr[1]);
    }
    update(time: number, delta: number): void {
        
    }

}