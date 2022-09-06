import { Player } from "./Player.js";
class App {
    constructor(selector) {
        var _a;
        this.canvas = document.querySelector(selector);
        this.ctx = (_a = this.canvas) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        this.player = new Player(200, 200, 30, 100);
        this.loop();
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
    }
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.player.render(this.ctx);
    }
}
window.addEventListener("load", () => {
    let app = new App("#gameCanvas");
});
