export default class TooltipHelper
{
    tooltipBox:HTMLDivElement;
    msgSpan:HTMLSpanElement;
    constructor()
    {
        this.tooltipBox = document.querySelector("#tooltip") as HTMLDivElement;
        this.msgSpan = this.tooltipBox.querySelector(".msg") as HTMLSpanElement;
    }

    showTooltip(parent: HTMLElement, target:HTMLElement, offset:number, msg:string  ):void
    {
        let parentRect = parent.getBoundingClientRect();
        let targetRect = target.getBoundingClientRect();

        let{x:tX,y:tY} = targetRect;
        let {x:pX,y:pY} = parentRect;

        let pos = {x:tX-pX,y:tY-pY};

        this.tooltipBox.style.top = `${pos.y+offset}px`;
        this.tooltipBox.style.left = `${pos.x}px`;

        this.msgSpan.innerHTML = msg;

        this.tooltipBox.classList.add("on");
    }

    closeTooltip():void
    {
        this.tooltipBox.classList.remove("on");
    }
}