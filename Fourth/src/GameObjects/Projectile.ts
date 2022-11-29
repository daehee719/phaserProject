import { iceball, Position } from "../Network/Protocol";

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
        this.body.setSize(20,20);
    }
    protected preUpdate(time: number, delta: number): void {
        super.preUpdate(time,delta);
        this.lifeTime += delta;
        if(this.lifeTime>= this.maxLifeTime)
        {
            this.setDisable();
        }
    }
    fire(data: iceball):void
    {
        let {position, damage, direction, lifeTime, ownerId, projectileId,velocity} = data;
        this.lifeTime = 0;
        this.maxLifeTime = lifeTime;
        this.x = position.x;
        this.y = position.y;
        this.ownerId = ownerId;
        this.damage = damage;
        this.setFlipX(direction<0);
        this.setVelocityX(velocity*direction);
        this.projectileId= projectileId;
    }
    setDisable():void
    {
        this.body.reset(0,0);
        this.setActive(false);
        this.setVisible(false);
    }

}