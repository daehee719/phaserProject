import Phaser from "phaser";

export default ( am: Phaser.Animations.AnimationManager) => {
    am.create({
        key:"idle",
        frames:am.generateFrameNumbers("player", {start:0, end:8}),
        frameRate:8,
        repeat: -1
    });
    am.create({
        key:"run",
        frames:am.generateFrameNumbers("player", {start:11, end:16}),
        frameRate:8,
        repeat: -1
    });
    am.create({
        key:"jump",
        frames:am.generateFrameNumbers("player", {start:17, end:23}),
        frameRate:4,
        repeat: 1
    });
};