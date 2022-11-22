export default class JobTimer
{
    action : ()=>void;
    time:number = 0;
    intervalTimer:NodeJS.Timer;

    constructor(time:number, action: ()=>void)
    {
        this.time = time;
        this.action = action;
    }

    startTimer():void
    {
        this.intervalTimer = setInterval(this.action,this.time);
    }

    stopTimer():void
    {
        clearInterval(this.intervalTimer);
    }
}