import 'phaser';
import PlayGameScene from './PlayGameScene';
import PreloadAssetScene from './PreloadAssetScene';
import {GameOption} from './GameOption';

const {width, height} = GameOption.gameSize;

let scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:'theGame',
    width, height,
}

let physicConfig: Phaser.Types.Core.PhysicsConfig = {
    default:'arcade',
    arcade: {
        gravity: {
            y:1200
        },
        debug:true
    }
}

let config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor:0x444444,
    scale: scaleObject,
    scene: [PreloadAssetScene, PlayGameScene],
    physics: physicConfig,
    pixelArt: true,
};

new Phaser.Game(config);