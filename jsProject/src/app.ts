import { Player } from "./Player.js";
import { Bullet } from "./Bullet.js";
import { Vector2 } from "./Vector2.js";
import { Button } from "./Button.js";

export class App {
  static instance: App;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  static debug: boolean = false;

  public player: Player;

  playTime: number;

  levelTimer: number = 0;
  gameOver: boolean = false;

  bulletList: Bullet[] = [];
  bulletImage: HTMLImageElement;
  mousePos: Vector2 = new Vector2(0, 0);

  restartBtn: Button;

  constructor(selector: string) {
    this.canvas = document.querySelector(selector) as HTMLCanvasElement;
    this.ctx = this.canvas?.getContext("2d") as CanvasRenderingContext2D;
    let playerImage: HTMLImageElement = new Image();
    this.bulletImage = new Image();
    this.playTime = 0;

    playerImage.src = "/dist/img/Player.png";
    this.bulletImage.src = "/dist/img/CircleBullet.png";
    this.player = new Player(200, 200, 45, 35, 100, playerImage);

    for (let i = 0; i < 30; i++) {
      let b: Bullet = this.makeBullet();
      this.bulletList.push(b);
    }
    this.canvas.addEventListener("mousemove", (e) => {
      let { offsetX, offsetY } = e;
      this.mousePos.x = offsetX;
      this.mousePos.y = offsetY;
    });
    this.canvas.addEventListener("click", (e) => {
      if (this.restartBtn.checkClick());
    });
    this.restartBtn = new Button(
      this.canvas.width / 2 - 60,
      300,
      120,
      60,
      "Restart?",
      () => {
        this.gameStart();
      }
    );
    this.loop(this.bulletImage);
  }

  gameStart(): void {
    this.playTime = 0;
    this.gameOver = false;
    this.levelTimer = 0;
    this.player.rect.pos = new Vector2(200, 200);
    this.bulletList = [];
    for (let i = 0; i < 30; i++) {
      let b: Bullet = this.makeBullet();
      this.bulletList.push(b);
    }
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

  checkLevel(): void {
    if (this.levelTimer >= 5) {
      this.levelTimer = 0;
      let b: Bullet = this.makeBullet();
      this.bulletList.push(b);
    }
  }
  makeBullet(): Bullet {
    let v = this.getRandomPositionInScreen();
    let b: Bullet = new Bullet(v.x, v.y, 15, 15, 300, this.bulletImage);
    b.setDirection(this.getToPlayerDirection(b));
    return b;
  }

  getToPlayerDirection(bullet: Bullet): Vector2 {
    let pc: Vector2 = this.player.rect.center;
    let bc: Vector2 = bullet.rect.center;
    return new Vector2(pc.x - bc.x, pc.y - bc.y).nomalize;
  }

  loop(bulletImage: HTMLImageElement): void {
    const dt = 1 / 60;
    setInterval(() => {
      this.update(dt, bulletImage);
      this.render();
    }, 1000 / 60);
  }

  update(dt: number, bulletImage: HTMLImageElement): void {
    this.restartBtn.update(dt);
    if (this.gameOver) return;
    this.bulletList.forEach((x) => x.update(dt));
    this.bulletList.forEach((x) => {
      if (x.isOutofScreen(this.canvas.width, this.canvas.height)) {
        let pos: Vector2 = this.getRandomPositionInScreen();
        x.rect.pos = pos;
        let dir: Vector2 = this.getToPlayerDirection(x);
        x.reset(pos, dir);
      }
    });

    this.player.update(dt);
    this.playTime += dt;
    this.levelTimer += dt;
    this.checkLevel();
    this.checkCollision();
  }
  checkCollision(): boolean {
    let isCol: boolean = false;
    this.bulletList.forEach((x) => {
      if (x.collider.checkCollision(this.player.collider)) {
        isCol = true;
      }
    });
    if (isCol) {
      console.log("BOOM!");
      this.gameOver = true;
    }
    return isCol;
  }
  renderUI(): void {
    let uiX: number = 10;
    let uiY: number = 10;
    this.ctx.save();
    this.ctx.font = "20px Arial";
    this.ctx.textBaseline = "top";
    this.ctx.textAlign = "center";
    this.ctx.fillText(`bullet amount : ${this.bulletList.length}`, uiX, uiY);
    this.ctx.fillText(
      `play time : ${this.playTime.toFixed(2)} `,
      uiX,
      uiY + 20
    );
    this.ctx.strokeStyle = "#000";
    let gagueX = this.canvas.width - 100;
    this.ctx.strokeRect(gagueX, uiY, 90, 15);
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(gagueX + 1, uiY + 1, (this.levelTimer / 5) * 88, 13);

    if (this.gameOver) {
      this.ctx.fillStyle = "rgba(0,0,0,0.3)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "#fff";
      this.ctx.font = "50px Arial";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "bottom";
      this.ctx.fillText("GameOver", this.canvas.width / 2, 150);
      this.ctx.fillText(
        `play time : ${this.playTime}`,
        this.canvas.width / 2,
        150
      );
      this.restartBtn.render(this.ctx);
    }
    this.ctx.restore();
  }

  render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.player.render(this.ctx);
    this.bulletList.forEach((x) => x.render(this.ctx));
    this.renderUI();
  }
}

window.addEventListener("load", () => {
  let app = new App("#gameCanvas");
  App.instance = app;
});
