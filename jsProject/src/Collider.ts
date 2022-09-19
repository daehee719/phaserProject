import { Rect } from "./Rect.js";

export class Collider {
  rect: Rect;
  offset: Rect;
  constructor(rect: Rect, offset: Rect) {
    this.rect = rect;
    this.offset = offset;
  }

  update(dt: number): void {}
  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = "green";
    let { x, y, width, height } = this.getCollisionRect();

    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }
  getCollisionRect(): Rect {
    let { x, y, width, height } = this.rect;
    let { x: x2, y: y2, width: width2, height: height2 } = this.offset;
    return new Rect(x + x2, y + y2, width + width2, height + height2);
  }

  checkCollision(other: Collider): Boolean {
    let otherRect: Rect = other.getCollisionRect();
    let myRect: Rect = this.getCollisionRect();

    return (
      myRect.x + myRect.width > otherRect.x &&
      otherRect.x + otherRect.width > myRect.x &&
      myRect.y + myRect.height > otherRect.y &&
      otherRect.y + otherRect.height > myRect.y
    );
  }
}
