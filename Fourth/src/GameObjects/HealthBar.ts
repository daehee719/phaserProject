import Phaser from "phaser";
import { Position } from "../Network/Protocol";

export default class HealthBar extends Phaser.GameObjects.Graphics
{
    size:Phaser.Math.Vector2;
    margin:number = 2;

    healthRatio:number = 1;

    pos : Position;
    constructor(scene:Phaser.Scene, position : Position,size:Phaser.Math.Vector2, margin:number = 2)
    {
        super(scene);
        this.pos = position;
        this.size = size;
        this.margin = margin;

        scene.add.existing(this);

        this.draw();
    }

    draw()
    {
        this.clear();
        let {x,y} = this.pos;
        let {x:width, y: height} = this.size;
        this.fillStyle(0x787878);
        this.fillRect(x - this.margin, y - this.margin, width + this.margin*2, height+ this.margin*2);

        this.fillStyle(0xffffff);
        this.fillRect(x,y,width,height);
        
        const barWidth = Math.floor(this.healthRatio * width);
        if(this.healthRatio <= 0.3)
        {
            this.fillStyle(0xff0000);
        }
        else 
        {
            this.fillStyle(0x32f232);
        }
        this.fillRect(x /* + (width-barWidth) */,y,barWidth, height);


    }

    setHealth(ratio:number)
    {
        this.healthRatio = ratio;
        this.draw();   
    }

    move(x:number, y:number)
    {
        this.pos.x = x;
        this.pos.y = y;
        this.draw();
    }
}