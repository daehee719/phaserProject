import Phaser from "phaser";

export default class PreloadAssetScene extends Phaser.Scene
{
    constructor()
    {
        super({key:"PreloadAsset"});
    }

    preload(): void 
    {
        //타일맵 데이터 및 타일 그림 로드
        this.load.tilemapTiledJSON("level1", "assets/level1_stage.json");
        this.load.image("tile_1", "assets/main_lev_build_1.png");

        //플레이어 이미지 로드
        this.load.spritesheet("player", "assets/player/move_sprite_1.png", {
            frameWidth:32,
            frameHeight:38,
            spacing:32
        });
    }

    create(): void 
    {
        this.scene.start("PlayGame");
    }
}