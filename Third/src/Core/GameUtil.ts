import Phaser from "phaser";

export default class GameUtil 
{
    static Rand(a:number[]): number 
    {
        return Phaser.Math.Between(a[0], a[1]);
    }
}