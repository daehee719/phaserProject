import { Player } from "./Player.js";
import { Bullet } from "./Bullet.js";

class App {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public player: Player;
  private bullet: Bullet;
  constructor(selector: string) {
    this.canvas = document.querySelector(selector) as HTMLCanvasElement;
    this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;
    this.player = new Player(200, 200, 30, 100);
    this.bullet = new Bullet(400, 400, 10, 300);
    this.loop();
  }

  loop(): void {
    const dt = 1 / 60;
    setInterval(() => {
      this.update(dt);
      this.render();
    }, 1000 / 60);
  }
  update(dt: number): void {
    this.player.update(dt);
    this.bullet.update(dt);
  }
  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.render(this.ctx);
    if (!this.bullet.isCollision(this.canvas, this.player)) {
      this.bullet.render(this.ctx);
    }
  }
}
window.addEventListener("load", () => {
  let app = new App("#gameCanvas");
});
