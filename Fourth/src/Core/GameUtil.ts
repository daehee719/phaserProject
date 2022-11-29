import Phaser from "phaser";

export const getTimeStamp = ():number=>
{
    let d = new Date();
    return d.getTime();
}

export const checkAnimationPlay = (as:Phaser.Animations.AnimationState,key:string):boolean=>
{
    return as.isPlaying&& as.currentAnim.key == key;
}