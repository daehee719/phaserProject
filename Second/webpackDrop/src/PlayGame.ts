import 'phaser'
import { GameOptions } from './Data/GameOption';
import PlayerSprite from './PlayerSprite';
import PlatformSprite from './PlatformSprite';
import GameObject = Phaser.GameObjects.GameObject;

//실제 게임 플레이가 이뤄지는 씬
export class PlayGameScene extends Phaser.Scene {
    player: PlayerSprite;
    gameWidth: number;
    gameHeight: number;

    sky: Phaser.GameObjects.Sprite;
    eyes: Phaser.GameObjects.Sprite;

    borderGraphics: Phaser.GameObjects.Graphics;
    spritePattern: Phaser.GameObjects.TileSprite;

    platformGroup: Phaser.Physics.Arcade.Group; 
    //물리오브젝트들을 하나의 그룹으로 묶는거

    actionCam: Phaser.Cameras.Scene2D.Camera;
    particleManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
    emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    levelText: Phaser.GameObjects.BitmapText;
    level:number = 0;
    gameOver:boolean = false;
    gameOverText: Phaser.GameObjects.BitmapText;

    constructor()
    {
        super("PlayGame");
    }

    create() : void {
        this.level = 0;
        this.gameOver = false;

        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;
        this.addSky(); //배경하늘 추가하기
        this.eyes = this.add.sprite(0, 0, 'eyes');
        this.eyes.setVisible(false);

        this.borderGraphics = this.add.graphics();
        this.borderGraphics.setVisible(false);

        this.spritePattern = this.add.tileSprite(
            this.gameWidth * 0.5, GameOptions.platformHeight * 0.5, 
            this.gameWidth, GameOptions.platformHeight * 2, 'pattern');
        this.spritePattern.setVisible(false);
        this.platformGroup = this.physics.add.group(); //새로운 피직스 그룹을 만들어준다.
        
        for(let i: number = 0; i < 12; i++)
        {
            this.addPlatform(i == 0);
        }

        this.player = new PlayerSprite(this, this.gameWidth * 0.5, 0, 'hero');

        this.input.on("pointerdown", this.destroyPlatform, this);
        
        this.levelText = this.add.bitmapText(this.gameWidth - 150, 10, "myFont", "0", 70);
        this.levelText.setOrigin(1, 0);

        this.gameOverText = this.add.bitmapText(this.gameWidth * 0.5, this.gameHeight * 0.5, "myFont", "Game\n Over", 200);
        this.gameOverText.setOrigin(0.5, 0.5);
        this.gameOverText.setVisible(false);

        this.createEmitter(); //이게 파티클 시스템을 만드는거다.
        this.setCamera(); //카메라 셋팅
    }

    addLevel(): void
    {
        this.level++;
        this.levelText.setText(this.level + "");
    }
    
    createEmitter(): void 
    {
        this.particleManager = this.add.particles('particle');
        this.emitter = this.particleManager.createEmitter({
            scale:{
                start:1,
                end:0
            },
            speed:{
                min:0,
                max:200
            },
            active:false,  //Play on awake
            lifespan: 500, //0.5초
            quantity: 50
        });
    }

    setCamera(): void{
        this.actionCam = this.cameras.add(0, 0, this.gameWidth, this.gameHeight);
        this.actionCam.ignore([this.sky, this.gameOverText, this.levelText]);

        this.actionCam.startFollow(this.player, true, 
                0, 0.5,   //xLerp, yLerp
                0, -(this.gameHeight * 0.5 - this.gameHeight * GameOptions.firstPlatformPosition)
                //x 오프셋, y오프셋
        );
        // http://data.gondr.net/deeperweb/
        this.cameras.main.ignore([this.player, this.particleManager]);
        //this.cameras.main.ignore([]);
        this.cameras.main.ignore(this.platformGroup);
        if(this.physics.world.debugGraphic != null)
        {
            this.cameras.main.ignore([this.physics.world.debugGraphic]);
        }
        
    }

    destroyPlatform(): void
    {
        if(this.player.canDestroyPlatform == true && this.player.isDie == false)
        {
            this.player.canDestroyPlatform = false;

            //let closePlatfrom: PlatformSprite  = (this.platformGroup.getChildren() as PlatformSprite[]).find( x => x.isHeroOnIt);
            let closePlatform: Phaser.Physics.Arcade.Body = 
                this.physics.closest(this.player) as Phaser.Physics.Arcade.Body;
            
            let p : PlatformSprite = closePlatform.gameObject as PlatformSprite;
            p.explodeAndDestroy(this.emitter); 
            this.initPlatform(p);
        }else if(this.gameOver == true)
        {
            this.scene.start("PlayGame");
        }
    }

    addPlatform(isFirst: boolean):void 
    {
        let p: PlatformSprite = new PlatformSprite(
            this, 
            this.gameWidth * 0.5,
            this.gameHeight * GameOptions.firstPlatformPosition,
            this.gameWidth / 8, 
            GameOptions.platformHeight
        );
        this.platformGroup.add(p);
        p.setPhysics();
        p.drawTexture(this.borderGraphics, this.spritePattern, this.eyes);
        
        if(isFirst)
        {
            p.setTint(0x00ff00);
            p.cnaLandOnIt = true; //착지가능하도록 바꿔줄꺼고
        }else {
            this.initPlatform(p);
        }
    }

    addSky() : void 
    {
        this.sky = this.add.sprite(0, 0, 'sky');
        this.sky.displayWidth = this.gameWidth;
        this.sky.displayHeight = this.gameHeight;
        this.sky.setOrigin(0, 0);

    }

    initPlatform(p: PlatformSprite) : void 
    {
        p.assignedVelocity = this.rand(GameOptions.xSpeedRange) * Phaser.Math.RND.sign();
        p.transformTo(this.gameWidth * 0.5,
            this.getLowestPlatformY() + this.rand(GameOptions.platformYDistanceRange),
            this.rand(GameOptions.platformLengthRange), GameOptions.platformHeight);
        p.drawTexture(this.borderGraphics, this.spritePattern, this.eyes);
    }
    
    getLowestPlatformY(): number 
    {
        let lowerY:number = 0;

        let platforms: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        
        lowerY = Math.max(... platforms.map( x => x.y) );
        
        return lowerY;
    }

    rand(arr: number[]): number 
    {
        return Phaser.Math.Between(arr[0], arr[1]);
    }

    displayGameOverScreen(): void
    {
        this.gameOver = true;
        this.gameOverText.setVisible(true);
    }

    update(time: number, delta:number) {
        if(this.player.isDie == false)
        {
            this.physics.world.collide(this.player, this.platformGroup, 
                this.handleCollision, undefined, this);
        }

        let pList: PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];
        //대현이 그발언..기억...
        pList.forEach(p => {
            if(p.y + this.gameHeight < this.player.y && this.gameOver == false) {
                this.displayGameOverScreen();
            }
            let a:number = Math.abs(this.gameWidth * 0.5 - p.x) / this.gameWidth * 0.5;
            let distance:number = Math.max(0.2, 1 - a ) * Math.PI * 0.5;

            p.body.setVelocityX( p.assignedVelocity * distance );

            let halfPlayer:number = this.player.displayWidth * 0.5;
            let pBound:Phaser.Geom.Rectangle = p.getBounds();
            let xVelocity:number = p.body.velocity.x;

            if( (xVelocity < 0 && pBound.left < halfPlayer)
                || (xVelocity > 0 && pBound.right > this.gameWidth - halfPlayer )) 
            {
                p.assignedVelocity *= -1;
            }
        });
    }

    handleCollision(body1: GameObject, body2: GameObject): void
    {
        let player: PlayerSprite = body1 as PlayerSprite;
        let platform: PlatformSprite = body2 as PlatformSprite;

        if(platform.isHeroOnIt == false)
        {
            //1. 플레이어가 왼쪽에 닿았는가?
            if(player.x < platform.getBounds().left)
            {
                this.fallAndDie(-1);
                return;
            }
            //2. 플레이어가 오른쪽에 닿았는가?
            if(player.x > platform.getBounds().right)
            {
                this.fallAndDie(1);
                return;
            }
            //3. 이 플랫폼이 착지가능한 플랫폼인가?
            if(platform.cnaLandOnIt == false)
            {
                this.fallAndDie(1);
                return;
            }
            
            platform.isHeroOnIt = true;
            platform.assignedVelocity = 0;
            player.canDestroyPlatform = true;

            this.paintSafePlatforms();
            this.addLevel();
        }
    }

    fallAndDie(multiplier : number) : void 
    {
        this.player.die(multiplier);
        //여기에 게임 재시작 및 카메라 무빙 처리가 들어가야 하고

        this.time.addEvent({
            delay:800,
            callback: () => this.actionCam.stopFollow()
        });
    }

    paintSafePlatforms() : void 
    {
        let first: PlatformSprite = this.getHighestPlatform(0) as PlatformSprite;
        first.setTint(0xff0000);
        let second: PlatformSprite = this.getHighestPlatform(first.y) as PlatformSprite;
        second.setTint(0x00ff00); //초록색
        second.cnaLandOnIt = true;
    }

    getHighestPlatform(bound:number) : PlatformSprite 
    {
        let pList:PlatformSprite[] = this.platformGroup.getChildren() as PlatformSprite[];

        let yList: number[] = pList.filter(x => x.y > bound).map( x => x.y);
        let minY = Math.min(...yList);
        let highPlat: PlatformSprite = pList.find(x => x.y == minY) as PlatformSprite;

        return highPlat;
    }
}