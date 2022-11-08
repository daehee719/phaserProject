
import Phaser from "phaser";
import GameUtil from "../Core/GameUtil";
import { GameOption } from "../GameOption";
import EnemySprite from "./EnemySprite";
import PlatformGroup from "./PlatformGroup";
import PlatformSprite from "./PlatformSprite";

export default class EnemyGroup extends Phaser.Physics.Arcade.Group
{
    pool: EnemySprite[]=[];
    constructor(world:Phaser.Physics.Arcade.World, scene:Phaser.Scene, pGroup:PlatformGroup)
    {
        super(world,scene);

        scene.physics.add.collider(this, pGroup);
        for(let i = 0;i < 15;i++)
        {
            let e = new EnemySprite(this,p,this.enemyGroup);
        }
    }

    groupToPool(e:EnemySprite):void
    {
        this.remove(e);
        this.pool.push(e);
    }

    poolToGroup(p:PlatformSprite):EnemySprite
    {
        let e = this.pool.shift() as EnemySprite;
        e.platform = p;

        e.x = p.x;
        e.y = p.y-120;
        e.setVisible(true);
        this.add(e);
        e.body.setAllowGravity(true);
        e.setVelocityX(GameUtil.Rand(GameOption.patrolSpeed));
        e.anims.play("enemy_run",true);
        e.setFlipY(false);
        return e;
    }
}