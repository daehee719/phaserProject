export class PlayGameScene extends Phaser.Scene {
    image: Phaser.GameObjects.Image;

    constructor()
    {
        super("PlayGameScene");
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