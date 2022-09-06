export class Player {
  x: number;
  y: number;
  size: number;
  speed: number;

  keyArr: boolean[] = [];

  constructor(x: number, y: number, size: number, speed: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;

    document.addEventListener("keydown", (e) => {
      this.keyArr[e.keyCode] = true;
    });
    document.addEventListener("keyup", (e) => {
      this.keyArr[e.keyCode] = false;
    });
  }

  update(dt: number): void {
    if (this.keyArr[37]) {
      this.x -= this.speed * dt;
    }
    if (this.keyArr[38]) {
      this.y -= this.speed * dt;
    }
    if (this.keyArr[39]) {
      this.x += this.speed * dt;
    }
    if (this.keyArr[40]) {
      this.y += this.speed * dt;
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#f00";
    const half: number = this.size / 2;
    ctx.fillRect(this.x - half, this.y - half, this.size, this.size);
  }
}
