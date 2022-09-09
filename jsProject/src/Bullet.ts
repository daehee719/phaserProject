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

  isCollision(canvas: HTMLCanvasElement, player: object): boolean {
    if (
      this.x == 0 ||
      this.y == 0 ||
      this.x == canvas.width - this.size ||
      this.x == canvas.height - this.size
    ) {
      console.log("Collision!");
      return true;
    }
    // else if(this.x ==  ) 플레이어 충돌 체크
    // else if(this.x + this.size >= )
    // {

    // }
    return false;
  }

  update(dt: number): void {
    this.x -= this.speed * dt;
  }
  render(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = "#f44";
    const half: number = this.size / 2;
    ctx.fillRect(this.x - half, this.y - half, this.size, this.size);
  }
}
