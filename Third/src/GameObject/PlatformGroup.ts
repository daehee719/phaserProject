import Phaser from "phaser";
import GameUtil from "../Core/GameUtil";
import { GameOption } from "../GameOption";
import PlatformSprite, { PlatformInitOption } from "./PlatformSprite";

export default class PlatformGroup extends Phaser.Physics.Arcade.Group
{
    constructor(world:Phaser.Physics.Arcade.World, scene: Phaser.Scene)
    {
        super(world, scene);
    }

    getPlatformInitOption(isFirst:boolean): PlatformInitOption
    {   
        let {width, height} = GameOption.gameSize;

        let x:number = isFirst ? width * 0.5 : width * 0.5 
            + GameUtil.Rand(GameOption.platformXDistance)
                * Phaser.Math.RND.sign();
        let y:number = isFirst ? height * 0.4 : 
            this.getLowerYPos()+GameUtil.Rand(GameOption.platformYDistance) ; //마지막 좌표 구하는거 지금 없어
        let pWidth:number = GameUtil.Rand(GameOption.platformRange) / GameOption.pixelScale;
        console.log(x, y, pWidth);
        return {x, y, width:pWidth};
    }

    getLowerYPos(): number 
    {
        let pos:number = 0;
        let platforms: PlatformSprite[] = this.getChildren() as PlatformSprite[];

        platforms.forEach( p => {
            pos = Math.max(pos, p.y); //둘중에 더 큰 애를 pos에 넣는다.
        });
        
        return pos;
    }
}