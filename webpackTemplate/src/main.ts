import Phaser from "phaser";

import { PlayGameScene } from "./PlayGameScene";
import { PreLoadScene } from "./PreLoadScene";

const ScaleObject: Phaser.Types.Core.ScaleConfig = {
  mode: Phaser.Scale.FIT,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  parent: "ggm",
  width: 640,
  height: 960,
};

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: ScaleObject,
  scene: [PreLoadScene, PlayGameScene],
};

new Phaser.Game(config);
