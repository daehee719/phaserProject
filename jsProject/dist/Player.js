export class Player {
    constructor(x, y, size, speed) {
        this.keyArr = [];
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
    update(dt) {
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
    render(ctx) {
        ctx.fillStyle = "#f00";
        const half = this.size / 2;
        ctx.fillRect(this.x - half, this.y - half, this.size, this.size);
    }
}
