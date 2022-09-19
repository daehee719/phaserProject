import { Collider } from "./Collider.js";
import { GameObject } from "./GameOject.js";
import { Rect } from "./Rect.js";
import { Vector2 } from "./Vector2.js";

export class Player extends GameObject {
  speed: number;
  keyArr: boolean[] = [];
  img: HTMLImageElement;
  collider: Collider;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    speed: number,
    img: HTMLImageElement
  ) {
    super(x, y, width, height);
    this.speed = speed;
    this.img = img;

    this.collider = new Collider(this.rect, new Rect(10,10,-20,-20));

    document.addEventListener("keydown", (e) => {
      this.keyArr[e.keyCode] = true;
    });
    document.addEventListener("keyup", (e) => {
      this.keyArr[e.keyCode] = false;
    });
  }

  update(dt: number): void {
    let delta: Vector2 = new Vector2(0, 0);
    if (this.keyArr[37]) {
      delta.x = -1;
    }
    if (this.keyArr[38]) {
      delta.y = -1;
    }
    if (this.keyArr[39]) {
      delta.x = 1;
    }
    if (this.keyArr[40]) {
      delta.y = 1;
    }
    delta = delta.nomalize;
    delta = delta.multiply(this.speed * dt);
    this.translate(delta);
  }

  render(ctx: CanvasRenderingContext2D): void {
    let { x, y, width, height } = this.rect;
    ctx.drawImage(this.img, x, y, width, height);
    this.collider.render(ctx);
  }
}
