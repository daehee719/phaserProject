import 'phaser'
import { GameOptions } from './Data/GameOption';
import PlayerSprite from './PlayerSprite'
import PlatformSprite from './PlatformSprite';
import GameObject = Phaser.GameObjects.GameObject;
export class PlayGameScene extends Phaser.Scene {
    player: PlayerSprite;
    gameWidth : number;
    gameHeight : number;

    sky : Phaser.GameObjects.Sprite;
    eyes : Phaser.GameObjects.Sprite;
    borderGraphics: Phaser.GameObjects.Graphics;
    spritePattern : Phaser.GameObjects.TileSprite;

    platformGroup : Phaser.Physics.Arcade.Group;

    actionCam : Phaser.Cameras.Scene2D.Camera;
    backGroundCam : Phaser.Cameras.Scene2D.Camera;
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

        this.input.on("pointerdown", this.destroyPlatform, this);
        this.setCamera();
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
        let lowerY:number = 0;

        let platforms: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];

        // for(let i = 0; i < platforms.length; i++)
        // {
        //     lowerY = Math.max(lowerY, platforms[i].y);
        // }
        lowerY = Math.max(... platforms.map(x=>x.y));
        return lowerY;
    }

    rand(arr:number[])
    {
        return Phaser.Math.Between(arr[0],arr[1]);
    }
    update(time: number, delta: number): void {
        if(this.player.isDie == false)
        {
            this.physics.world.collide(this.player, this.platformGroup, this.handleCollision,undefined,this);
        }

        let pList : PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];

        pList.forEach(p=>
            {
                let a : number = Math.abs(this.gameWidth*0.5 - p.x);
                let b : number = this.gameWidth * 0.5;
                let distance:number = Math.max(0.2, 1-(a/b)*Math.PI*0.5);
                p.body.setVelocityX(p.assignedVelocity);

                let halfPlayer: number = this.player.displayWidth*0.5;
                let pBound:Phaser.Geom.Rectangle = p.getBounds();
                let xVelocity : number = p.body.velocity.x;
                if(xVelocity<0 && pBound.left<halfPlayer
                || xVelocity>0 && pBound.right>this.gameWidth - halfPlayer)
                {
                    p.assignedVelocity *= -1;
                }
            })
    }
    destroyPlatform():void{
        if(this.player.canDestroyPlatform && this.player.isDie==false)
        {
            this.player.canDestroyPlatform = false;

            let closePlatform: Phaser.Physics.Arcade.Body 
                = this.physics.closest(this.player) as Phaser.Physics.Arcade.Body;
            let p : PlatformSprite = closePlatform.gameObject as PlatformSprite;
            p.explodeAndDestroy();
            this.initPlatform(p);
        }
    }

    setCamera():void{
        this.actionCam = this.cameras.add(0,0,this.gameWidth,this.gameHeight);
        this.actionCam.ignore([this.sky]);
        this.actionCam.startFollow(this.player, true,0,0.5,0,
            -(this.gameHeight*0.5 - this.gameHeight * GameOptions.firstPlatformPosition));
        this.cameras.main.ignore([this.player]);
        this.cameras.main.ignore(this.platformGroup);
        if(this.physics.world.debugGraphic != null)
        {
            this.cameras.main.ignore([this.physics.world.debugGraphic]);
        }
    }

    handleCollision(body1 : GameObject, body2 : GameObject)
    {   
        let player:PlayerSprite = body1 as PlayerSprite;
        let platform : PlatformSprite = body2 as PlatformSprite;

        if(platform.isHeroOnIt == false)
        {
            if(player.x<platform.getBounds().left)
            {
                this.fallAndDie(-1);
                return;
            }
            if(player.x>platform.getBounds().right)
            {
                this.fallAndDie(1);
                return;
            }
            if(platform.cnaLandOnIt == false)
            {
                this.fallAndDie(1);
                return;
            }
            platform.isHeroOnIt = true;
            player.canDestroyPlatform = true;
            platform.assignedVelocity = 0;
            this.paintSafePlatforms();
        }
    }

    fallAndDie(multiplier:number):void
    {
        this.player.die(multiplier);

        this.time.addEvent({
            delay:800,
            callback:()=> this.actionCam.stopFollow()
        })
    }

    paintSafePlatforms() : void
    {
        let first : PlatformSprite | undefined= this.getHighestPlatform(0);
        first.setTint(0xff0000);
        let second : PlatformSprite = this.getHighestPlatform(first.y);
        second.setTint(0x00ff00);
        second.cnaLandOnIt = true;

    }

    getHighestPlatform(bound:number) : PlatformSprite
    {
        let maY : number = Infinity;
        let highPlat: PlatformSprite ;
        let platforms: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        highPlat = platforms[0];

        
        for(let i = 0; i < platforms.length; i++)
        {
            if(platforms[i].y<=maY && platforms[i].y>bound)
            {
                maY = platforms[i].y;
                highPlat = platforms[i] as PlatformSprite;
            }
        }
        return highPlat;
    }
}