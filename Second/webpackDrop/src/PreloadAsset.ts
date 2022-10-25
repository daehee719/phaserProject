export class PreloadAsset extends Phaser.Scene
{
    constructor()
    {
        super({key:"PreloadAsset"});
    }

    preload(): void
    {
        this.load.image('hero','assets/hero.png');
        this.load.image('pattern','assets/pattern.png');
        this.load.image('eyes','assets/eyes.png');
        this.load.image('particle','assets/particle.png');
        this.load.image('sky','assets/sky.png');
    }

    create():void
    {
        this.scene.start("PlayGame");
    }
}