import { App } from "./app.js";
import { GameObject } from "./GameOject.js";
export class Button extends GameObject {
    constructor(x, y, width, height, text, action) {
        super(x, y, width, height);
        this.isHover = false;
        this.text = text;
    }
    update(dt) {
        let pos = App.instance.mousePos;
        let { x, y, width, height } = this.rect;
        this.isHover =
            pos.x > x && pos.x < x + width && pos.y > y && pos.y < y + height;
    }
}
checkClick();
void {
    : .isHover
};
{
    this.action();
}
render(ctx, CanvasRenderingContext2D);
void {
    ctx, : .save(),
    ctx, : .fillStyle = "#fff",
    let
};
{
    x, y, width, height;
}
this.rect;
ctx.fillRect(x, y, width, height);
if (this.isHover) {
    ctx.fillStyle = "#777";
}
else {
    ctx.fillStyle = "#000";
}
ctx.fillRect(x + 3, y + 3, width - 6, height - 6);
ctx.fillStyle = "#fff";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.font = "18px Arial";
ctx.fillText(this.text, x + width / 2, y + height / 2);
ctx.restore();
