import Phaser from "phaser";

export class PreLoadScene extends Phaser.Scene {
  constructor() {
    super({ key: "Preload" });
  }

  preload(): void {
    this.load.image("base", "./assets/base.png");
    this.load.image("square", "./assets/square.png");
    this.load.image("top", "./assets/top.png");

    this.load.bitmapFont("myFont", "./Assets/font.png", "./Assets/font.fnt");
    console.log("preload Preload");
  }

  create(): void {
    this.scene.start("PlayGame");
    console.log("preload create");
  }
}
