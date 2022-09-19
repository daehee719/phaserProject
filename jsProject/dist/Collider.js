import { Rect } from "./Rect.js";
export class Collider {
    constructor(rect, offset) {
        this.rect = rect;
        this.offset = offset;
    }
    update(dt) { }
    render(ctx) {
        ctx.save();
        ctx.strokeStyle = "green";
        let { x, y, width, height } = this.getCollisionRect();
        ctx.strokeRect(x, y, width, height);
        ctx.restore();
    }
    getCollisionRect() {
        let { x, y, width, height } = this.rect;
        let { x: x2, y: y2, width: width2, height: height2 } = this.offset;
        return new Rect(x + x2, y + y2, width + width2, height + height2);
    }
    checkCollision(other) {
        let otherRect = other.getCollisionRect();
        let myRect = this.getCollisionRect();
        return (myRect.x + myRect.width > otherRect.x &&
            otherRect.x + otherRect.width > myRect.x &&
            myRect.y + myRect.height > otherRect.y &&
            otherRect.y + otherRect.height > myRect.y);
    }
}
