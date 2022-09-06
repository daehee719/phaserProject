"use strict";
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    print() {
        console.log(this.x, this.y);
    }
}
let p = new Player(10, 20);
p.print();
p.print();
