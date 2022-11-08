import Phaser from "phaser";

export interface SpriteSet 
{
    leftSprite:Phaser.GameObjects.Sprite,
    rightSprite:Phaser.GameObjects.Sprite,
    middleSprite:Phaser.GameObjects.Sprite,
}

export default (scene: Phaser.Scene) : SpriteSet => {
    let leftSprite = scene.add.sprite(0, 0, "leftplatform");
    leftSprite.setOrigin(0, 0);
    leftSprite.setVisible(false);

    let rightSprite = scene.add.sprite(0, 0, "rightplatform");
    rightSprite.setOrigin(1, 0);
    rightSprite.setVisible(false);

    let middleSprite = scene.add.sprite(0, 0, "platform");
    middleSprite.setOrigin(0, 0);
    middleSprite.setVisible(false);

    return {leftSprite, rightSprite, middleSprite};
}