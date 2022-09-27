import Phaser from "phaser";

export class Logo extends Phaser.GameObjects.Image {
  scene: Phaser.Scene;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
  }

  moveTo(x: number, y: number) {
    this.scene.tweens.add({
      targets: this.scene,
      x,
      y,
      duration: 1000,
      ease: "Cubic.easeOut",
      //   yoyo: true,
      //   repeat: -1,
    });
  }
}
