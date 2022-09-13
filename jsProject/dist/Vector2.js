export class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    get magnitude() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    get nomalize() {
        const m = this.magnitude;
        if (m != 0)
            return new Vector2(this.x / m, this.y / m);
        return new Vector2(0, 0);
    }
    multiply(n) {
        return new Vector2(this.x * n, this.y * n);
    }
    add(v) {
        this.x += v.x;
        this.y += v.y;
    }
}
