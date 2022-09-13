import { Player } from "./Player.js";
import { Bullet } from "./Bullet.js";
import { Vector2 } from "./Vector2.js";

class App {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  public player: Player;

  bulletList: Bullet[] = [];
  constructor(selector: string) {
    this.canvas = document.querySelector(selector) as HTMLCanvasElement;
    this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;
    let playerImage: HTMLImageElement = new Image();
    let bulletImage: HTMLImageElement = new Image();

    playerImage.src = "/dist/img/Player.png";
    bulletImage.src = "/dist/img/CircleBullet.png";
    this.player = new Player(200, 200, 45, 35, 100, playerImage);
    let playerCenter: Vector2 = this.player.rect.center;

    for (let i = 0; i < 30; i++) {
      let v = this.getRandomPositionInScreen();
      let b: Bullet = new Bullet(v.x, v.y, 15, 15, 300, bulletImage);
      let bulletCenter: Vector2 = b.rect.center;

      b.setDirection(
        new Vector2(
          playerCenter.x - bulletCenter.x,
          playerCenter.y - bulletCenter.y
        ).nomalize
      );
      this.bulletList.push(b);
    }
    this.loop();
  }

  getRandomPositionInScreen(): Vector2 {
    let idx: number = Math.floor(Math.random() * 4);
    let x = 0;
    let y = 0;
    switch (idx) {
      case 0:
        y = -30;
        x = Math.random() * this.canvas.width;
        break;
      case 1:
        x = -30;
        y = Math.random() * this.canvas.height;
        break;
      case 2:
        x = this.canvas.width + 30;
        y = Math.random() * this.canvas.height;
        break;
      case 3:
        x = Math.random() * this.canvas.width;
        y = this.canvas.height + 30;
        break;
    }
    return new Vector2(x, y);
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

    this.bulletList.forEach((x) => x.update(dt));
    this.bulletList.forEach((x) => {
      if (x.isOutofScreen(this.canvas.width, this.canvas.height))
        x.reset(this.getRandomPositionInScreen());
    });

    //5초 시간이 지날 수록 총알 수가 하나씩 더 늘어나도로
    // 화면 왼쪽 상단에 현재 총알 수 와 현재 시간이 표기되도록 하기(이건 검색 필요)
  }
  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.render(this.ctx);
    this.bulletList.forEach((x) => x.render(this.ctx));
  }
}
window.addEventListener("load", () => {
  let app = new App("#gameCanvas");
});
