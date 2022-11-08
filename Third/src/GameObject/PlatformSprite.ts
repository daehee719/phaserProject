import Phaser, { Scenes } from "phaser";
import { GameOption } from "../GameOption";
import Sprite = Phaser.GameObjects.Sprite;

export interface PlatformInitOption 
{
    x:number;
    y:number;
    width:number;
}

export default class PlatformSprite extends Phaser.GameObjects.RenderTexture
{
    letfSprite:Sprite;
    rightSprite:Sprite;
    middleSprite:Sprite;

    body: Phaser.Physics.Arcade.Body;
    group: Phaser.Physics.Arcade.Group;

    constructor(scene:Phaser.Scene, group: Phaser.Physics.Arcade.Group, left:Sprite, right:Sprite, middle:Sprite, option: PlatformInitOption)
    {
        super(scene, 0, 0, 1, 16); //width  height 1, 16 짜리로 하나 만들어두고 
        this.letfSprite = left;
        this.rightSprite = right;
        this.middleSprite = middle;

        this.group = group;
        this.group.add(this);
        this.setOrigin(0.5); //정 가운데로 오리진 잡아주고
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true); //플레이어가 여기다가 갔다 밖아도 이동하거나 그러지 않는다.
        this.body.setAllowGravity(false);

        this.init(option);
    }

    init(option:PlatformInitOption):void 
    {
        this.scale = GameOption.pixelScale;
        this.x = option.x;
        this.y = option.y;
        this.setSize(option.width, 16);
        this.body.setSize(option.width, 16);

        this.middleSprite.displayWidth = option.width;

        this.draw(this.middleSprite, 0, 0);
        this.draw(this.letfSprite, 0, 0);
        this.draw(this.rightSprite, option.width, 0);
    }
}