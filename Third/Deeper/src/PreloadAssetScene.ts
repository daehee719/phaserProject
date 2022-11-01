import Phaser from 'phaser'
export default class PreloadAssetScene extends Phaser.Scene
{
    constructor()
    {
        super({key:"PreloadAssetScene"})
    }
    preload():void{
        this.load.image("platform", "assets/plaform.png");
        this.load.image("background","assets/background.png");
        this.load.image("leftplatform","assets/leftplatformedge.png");
        this.load.image("rightplatform","assets/rightplatformedge.png");
            


        this.load.spritesheet('hero','assets/hero.png',{
            frameWidth:32,
            frameHeight:32
        })
    }
    create():void{
        this.scene.start("PlayGameScene");
    }
}