import { Position } from "../Network/Protocol";

export default class Projectile extends Phaser.Physics.Arcade.Sprite
{
    body:Phaser.Physics.Arcade.Body;

    lifeTime:number;
    maxLifeTime:number;
    damage:number = 1;
    direction:number = 1;

    ownerId : string;

    projectileId:number;
    constructor(scene:Phaser.Scene, x:number, y:number, key:string)
    {
        super(scene,x,y,key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
    }
    fire(pos:Position, lifeTime:number, speed:number, direction:number, ownerId:string, projectileId:number)
    {
        this.lifeTime = 0;
        this.maxLifeTime = lifeTime;
        this.x = pos.x;
        this.y = pos.y;
        this.ownerId = ownerId;
        this.setFlipX(direction<0);
        this.setVelocityX(speed*direction);
    }
}