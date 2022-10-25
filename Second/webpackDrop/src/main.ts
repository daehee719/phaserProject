import 'phaser';
import { Physics } from 'phaser';
import {PlayGameScene} from './PlayGame'
import {PreloadAsset} from './PreloadAsset'
import {GameOptions} from './Data/GameOption'

let scaleObject: Phaser.Types.Core.ScaleConfig = {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent:'theGame',
    width:750,
    height:1334,
}

const physicsObject : Phaser.Types.Core.PhysicsConfig = 
{
    default:'arcade',
    arcade:
    {
        gravity:
        {
            y:GameOptions.gameGravity
        },
        debug:true
    }
}

let config:Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor:0x87ceea,
    scale: scaleObject,
    scene: [PreloadAsset,PlayGameScene],
    physics:physicsObject
};

new Phaser.Game(config);