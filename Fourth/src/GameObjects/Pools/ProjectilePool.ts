import Phaser from "phaser";
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
        const p = this.getFirstDead(true) as Projectile;
        
        p.setActive(true);
        p.setVisible(true);

        return p; 
    }
}