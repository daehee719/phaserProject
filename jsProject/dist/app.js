import { Player } from "./Player.js";
import { Bullet } from "./Bullet.js";
import { Vector2 } from "./Vector2.js";
class App {
    constructor(selector) {
        var _a;
        this.bulletList = [];
        this.canvas = document.querySelector(selector);
        this.ctx = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        let playerImage = new Image();
        let bulletImage = new Image();
        playerImage.src = "/dist/img/Player.png";
        bulletImage.src = "/dist/img/CircleBullet.png";
        this.player = new Player(200, 200, 45, 35, 100, playerImage);
        let playerCenter = this.player.rect.center;
        for (let i = 0; i < 30; i++) {
            let v = this.getRandomPositionInScreen();
            let b = new Bullet(v.x, v.y, 15, 15, 300, bulletImage);
            let bulletCenter = b.rect.center;
            b.setDirection(new Vector2(playerCenter.x - bulletCenter.x, playerCenter.y - bulletCenter.y).nomalize);
            this.bulletList.push(b);
        }
        this.loop();
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
    loop() {
        const dt = 1 / 60;
        setInterval(() => {
            this.update(dt);
            this.render();
        }, 1000 / 60);
    }
    update(dt) {
        this.player.update(dt);
        this.bulletList.forEach((x) => x.update(dt));
        this.bulletList.forEach((x) => {
            if (x.isOutofScreen(this.canvas.width, this.canvas.height))
                x.reset(this.getRandomPositionInScreen());
        });
        //5�� �ð��� ���� ���� �Ѿ� ���� �ϳ��� �� �þ����
        // ȭ�� ���� ��ܿ� ���� �Ѿ� �� �� ���� �ð��� ǥ��ǵ��� �ϱ�(�̰� �˻� �ʿ�)
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.ctx);
        this.bulletList.forEach((x) => x.render(this.ctx));
    }
}
window.addEventListener("load", () => {
    let app = new App("#gameCanvas");
});
