class Player {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  print(): void {
    console.log(this.x, this.y);
  }
}

let p: Player = new Player(10, 20);
p.print();
p.print();
