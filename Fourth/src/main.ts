import Phaser from 'phaser'
import {GameOption} from "./GameOption"
import PlayGameScene from './Scenes/PlayGameScene';
import PreloadAssetScene from './Scenes/PreloadAssetScene';

let scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:'theGame',
    width:GameOption.width,
    height:GameOption.height,
}

let physicsConfig : Phaser.Types.Core.PhysicsConfig = {
    default:'arcade',
    arcade: {
        debug:true,
        gravity:{y:500}
    }
}

let config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    physics:physicsConfig,
    scale: scaleObject,
    scene: [PreloadAssetScene, PlayGameScene],
    pixelArt: true
};

new Phaser.Game(config);