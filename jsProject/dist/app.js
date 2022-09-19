import { Player } from "./Player.js";
import { Bullet } from "./Bullet.js";
import { Vector2 } from "./Vector2.js";
import { Button } from "./Button.js";
export class App {
    constructor(selector) {
        var _a;
        this.levelTimer = 0;
        this.gameOver = false;
        this.bulletList = [];
        this.mousePos = new Vector2(0, 0);
        this.canvas = document.querySelector(selector);
        this.ctx = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        let playerImage = new Image();
        this.bulletImage = new Image();
        this.playTime = 0;
        playerImage.src = "/dist/img/Player.png";
        this.bulletImage.src = "/dist/img/CircleBullet.png";
        this.player = new Player(200, 200, 45, 35, 100, playerImage);
        for (let i = 0; i < 30; i++) {
            let b = this.makeBullet();
            this.bulletList.push(b);
        }
        this.canvas.addEventListener("mousemove", (e) => {
            let { offsetX, offsetY } = e;
            this.mousePos.x = offsetX;
            this.mousePos.y = offsetY;
        });
        this.canvas.addEventListener("click", (e) => {
            if (this.restartBtn.checkClick())
                ;
        });
        this.restartBtn = new Button(this.canvas.width / 2 - 60, 300, 120, 60, "Restart?", () => {
            //���� ����� �ϴ� �Լ� ����
            //����ÿ� ȭ�� ����� ���� ��ƾ �ð� ������
        });
        this.loop(this.bulletImage);
    }
    getRandomPositionInScreen() {
        let idx = Math.floor(Math.random() * 4);
        let x = 0;
        let y = 0;
        switch (idx) {
            case 0:
                y = -30;
                x = Math.random() * this.canvas.width;
                break;
            case 1:
                x = -30;
                y = Math.random() * this.canvas.height;
                break;
            case 2:
                x = this.canvas.width + 30;
                y = Math.random() * this.canvas.height;
                break;
            case 3:
                x = Math.random() * this.canvas.width;
                y = this.canvas.height + 30;
                break;
        }
        return new Vector2(x, y);
    }
    checkLevel() {
        if (this.levelTimer >= 5) {
            this.levelTimer = 0;
            let b = this.makeBullet();
            this.bulletList.push(b);
        }
    }
    makeBullet() {
        let v = this.getRandomPositionInScreen();
        let b = new Bullet(v.x, v.y, 15, 15, 300, this.bulletImage);
        b.setDirection(this.getToPlayerDirection(b));
        return b;
    }
    getToPlayerDirection(bullet) {
        let pc = this.player.rect.center;
        let bc = bullet.rect.center;
        return new Vector2(pc.x - bc.x, pc.y - bc.y).nomalize;
    }
    loop(bulletImage) {
        const dt = 1 / 60;
        setInterval(() => {
            this.update(dt, bulletImage);
            this.render();
        }, 1000 / 60);
    }
    update(dt, bulletImage) {
        this.restartBtn.update(dt);
        if (this.gameOver)
            return;
        this.bulletList.forEach((x) => x.update(dt));
        this.bulletList.forEach((x) => {
            if (x.isOutofScreen(this.canvas.width, this.canvas.height)) {
                let pos = this.getRandomPositionInScreen();
                x.rect.pos = pos;
                let dir = this.getToPlayerDirection(x);
                x.reset(pos, dir);
            }
        });
        this.player.update(dt);
        this.playTime += dt;
        this.levelTimer += dt;
        this.checkLevel();
        this.checkCollision();
    }
    checkCollision() {
        let isCol = false;
        this.bulletList.forEach((x) => {
            if (x.collider.checkCollision(this.player.collider)) {
                isCol = true;
            }
        });
        if (isCol) {
            console.log("BOOM!");
            this.gameOver = true;
        }
        return isCol;
    }
    renderUI() {
        let uiX = 10;
        let uiY = 10;
        this.ctx.save();
        this.ctx.font = "20px Arial";
        this.ctx.textBaseline = "top";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`bullet amount : ${this.bulletList.length}`, uiX, uiY);
        this.ctx.fillText(`play time : ${this.playTime.toFixed(2)} `, uiX, uiY + 20);
        this.ctx.strokeStyle = "#000";
        let gagueX = this.canvas.width - 100;
        this.ctx.strokeRect(gagueX, uiY, 90, 15);
        this.ctx.fillStyle = "green";
        this.ctx.fillRect(gagueX + 1, uiY + 1, (this.levelTimer / 5) * 88, 13);
        if (this.gameOver) {
            this.ctx.fillStyle = "rgba(0,0,0,0.3)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "#fff";
            this.ctx.font = "50px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "bottom";
            this.ctx.fillText("GameOver", this.canvas.width / 2, 150);
            this.restartBtn.render(this.ctx);
        }
        this.ctx.restore();
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.ctx);
        this.bulletList.forEach((x) => x.render(this.ctx));
        this.renderUI();
    }
}
window.addEventListener("load", () => {
    let app = new App("#gameCanvas");
    App.instance = app;
});
