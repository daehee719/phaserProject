import Phaser from "phaser";
import { Position } from "../../Network/Protocol";
import Projectile from "../Projectile";

export default class ProjectilePool extends Phaser.Physics.Arcade.Group
{
    static Instance : ProjectilePool;
    pool : Projectile[];

    constructor(scene:Phaser.Scene)
    {
        super(scene.physics.world, scene);
        this.pool = this.createMultiple({
            classType : Projectile,
            frameQuantity:10,
            active:false,
            visible:false,
            key:"iceball",
        })as Projectile[];
        this.pool.forEach(x=>x.body.setAllowGravity(false));
    }
    getProjectile():Projectile
    {
        let p = this.getFirstDead(false) as Projectile;
        if(p == null)
        {
            p = new Projectile(this.scene, 0,0,"iceball");
            this.add(p);
            this.pool.push(p);
            p.body.setAllowGravity(false);
        }
        else
        {
            p.setActive(true);
            p.setVisible(true);
        }

        return p;
    }

    searchAndDisable(id:number, pLtPosition:Position):void
    {
        let p = this.pool.find(x => x.projectileId == id);
        if(p == undefined)
        {
            console.log(`error : no projectile id ${id}`);
            return;
        }
        p.setDisable();
    }
}