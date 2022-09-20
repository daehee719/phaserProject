import { GameObject } from "./GameObject.js";
import { App } from "./app.js";
import * as Vector2Js from "./Vector2.js";

export class Button extends GameObject {
  text: string;
  isHover: boolean = false; //���콺 �� ���� �Դٸ� Ʈ��
  action: Function;
  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    action: Function
  ) {
    super(x, y, width, height);
    this.text = text;
    this.action = action;
  }

  update(dt: number): void {
    let pos: Vector2Js.Vector2 = App.instance.mousePos;
    let { x, y, width, height } = this.rect;
    this.isHover =
      pos.x > x && pos.x < x + width && pos.y > y && pos.y < y + height;
  }
  checkClick(): void {
    if (this.isHover) {
      this.action();
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.fillStyle = "#fff";
    let { x, y, width, height } = this.rect;
    ctx.fillRect(x, y, width, height);
    if (this.isHover) {
      ctx.fillStyle = "#777";
    } else {
      ctx.fillStyle = "#000";
    }

    ctx.fillRect(x + 3, y + 3, width - 6, height - 6);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center"; //�ؽ�Ʈ�� ���� ����
    ctx.textBaseline = "middle"; //�ؽ�Ʈ�� ���� ����
    ctx.font = "18px Arial";
    ctx.fillText(this.text, x + width / 2, y + height / 2);
    ctx.restore();
  }
}
