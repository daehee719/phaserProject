export default class Person extends Phaser.GameObjects.Sprite {
  successful: number;
  constructor(scene: Phaser.Scene, x: number, y: number, key: string) {
    super(scene, x, y, key);
    this.successful = 0;
    this.setScale(0.2);
  }
}
