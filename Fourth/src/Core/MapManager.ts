import Phaser from 'phaser'

export default class MapManager 
{
    static Instance: MapManager; //싱글톤 만들려고 하는거

    map: Phaser.Tilemaps.Tilemap;
    platforms: Phaser.Tilemaps.TilemapLayer;
    environments: Phaser.Tilemaps.TilemapLayer;
    collisions: Phaser.Tilemaps.TilemapLayer;

    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene, key:string)
    {
        this.scene = scene;
        this.map = scene.make.tilemap({key});
        this.map.addTilesetImage("main_lev_build_1", "tile_1");

        this.createLayers();
    }

    createLayers(): void 
    {
        const tileSet = this.map.getTileset("main_lev_build_1");
        this.platforms = this.map.createLayer("Platforms", tileSet);
        this.environments = this.map.createLayer("Environments", tileSet);

        this.collisions = this.map.createLayer("Collisions", tileSet);
        this.collisions.setVisible(false);

        //this.collisions.setCollisionByExclusion([-1], true);
        this.collisions.setCollisionByProperty({collide:true}, true);
    }
}