import 'phaser';

class PlayGameScene extends Phaser.Scene {
    image: Phaser.GameObjects.Image;

    constructor()
    {
        super("PlayGame");
    }

    preload() {
        this.load.image('logo', 'assets/logo.png');
    }
    create() {
        this.image = this.add.image(400, 300, 'logo');
        //this.image.setScale(0.1);
    }
    update(time: number, delta:number) {
        this.image.rotation += 15 * delta * 0.0001;
    }
}
let scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:'theGame',
    width:320,
    height:320,
}

let config = {
    type: Phaser.AUTO,
    scale: scaleObject,
    scene: PlayGameScene
};

new Phaser.Game(config);