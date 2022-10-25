import 'phaser'
import { GameOptions } from './Data/GameOption';
import PlayerSprite from './PlayerSprite'
import PlatformSprite from './PlatformSprite';
export class PlayGameScene extends Phaser.Scene {
    player: PlayerSprite;
    gameWidth : number;
    gameHeight : number;

    sky : Phaser.GameObjects.Sprite;
    borderGraphics: Phaser.GameObjects.Graphics;
    spritePattern : Phaser.GameObjects.TileSprite;
    constructor()
    {
        super("PlayGame");
    }

    create():void{
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;
        this.addSky();
        
        this.borderGraphics = this.add.graphics();
        this.borderGraphics.setVisible(false);

        this.spritePattern = this.add.tileSprite(this.gameWidth*0.5, GameOptions.platformHeight*0.5,
            this.gameWidth, GameOptions.platformHeight*2,'pattern');

        this.spritePattern.setVisible(false);
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
            p.setPhysics();
        p.drawTexture(this.borderGraphics,this.spritePattern); 3
    }

    addSky():void{
        this.sky = this.add.sprite(0,0,'sky');
        this.sky.displayWidth = this.gameWidth;
        this.sky.displayHeight = this.gameHeight;
        this.sky.setOrigin(0,0);
    }
    update(time: number, delta: number): void {
        
    }

}