import Phaser from 'phaser';

export default class PreloadAssetScene extends Phaser.Scene
{
    constructor()
    {
        super({key:"PreloadAssetScene"});
    }
    preload():void 
    {
        this.load.image("platform", "assets/platform.png");
        this.load.image("background", "assets/background.png");
        this.load.image("leftplatform", "assets/leftplatformedge.png");
        this.load.image("rightplatform", "assets/rightplatformedge.png");

        
        this.load.spritesheet('hero', 'assets/hero.png', {
            frameWidth:32,
            frameHeight:32
        });
        this.load.spritesheet('hero_run', 'assets/hero_run.png', {
            frameWidth:32,
            frameHeight:32
        });


        this.load.spritesheet('enemy', 'assets/enemy.png', {
            frameWidth:36,
            frameHeight:30
        });
        this.load.spritesheet('enemy_hit', 'assets/enemy_hit.png', {
            frameWidth:36,
            frameHeight:30
        });
        
    }

    create(): void
    {
        this.scene.start("PlayGameScene");
    }
}