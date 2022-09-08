export class Bullet {
  x: number;
  y: number;
  size: number;
  speed: number;

  constructor(x: number, y: number, size: number, speed: number) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
  }

  isCollision(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ): boolean {
    if (
      this.x == 0 ||
      this.y == 0 ||
      this.x == canvas.width - this.size ||
      this.x == canvas.height - this.size
    ) {
      ctx.clearRect(this.x, this.y, this.size, this.size);
      return true;
    }
    return false;
    // else if(this.x ==  ) 플레이어 충돌 체크
  }

  update(dt: number): void {}
}
