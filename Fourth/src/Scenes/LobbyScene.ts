import Phaser from "phaser";
import TooltipHelper from "../Core/TooltipHelper";

export default class LobbyScene extends Phaser.Scene
{
    UIDiv:HTMLElement;
    gameCanvas:HTMLCanvasElement;
    tooltipHelper : TooltipHelper
    constructor()
    {
        super({key:"Lobby"});
        this.UIDiv = document.querySelector("#gameDiv") as HTMLDivElement;
        this.gameCanvas = document.querySelector("#theGame > canvas") as HTMLCanvasElement;
        this.tooltipHelper = new TooltipHelper();
        this.resizeUI(20);
        window.addEventListener("resize", ()=> this.resizeUI(20));
        this.setUpLoginScene();
    }

    create():void
    {
        const sky = this.add.image(0,0,"bg_sky").setOrigin(0,0).setScale(4.5);
    }

    resizeUI(time:number):void
    {
        setTimeout(() => {
        const {width,height, marginLeft, marginTop} = this.gameCanvas.style;
        this.UIDiv.style.width = width;
        this.UIDiv.style.height = height;
        this.UIDiv.style.marginLeft = marginLeft;
        this.UIDiv.style.marginTop = marginTop;

        let pages = this.UIDiv.querySelectorAll("#pageContainer > div") as NodeListOf<HTMLDivElement>
        pages.forEach(p =>{
            p.style.width = width;
            p.style.height = height;
        })
    }, time);
    }

    setUpLoginScene():void
    {
        const nameInput = document.querySelector("#nameInput") as HTMLInputElement;
        const loginBtn = document.querySelector("#btnLogin") as HTMLButtonElement;

        loginBtn.addEventListener("click",e=>
        {
            let name = nameInput.value.trim();
            if(name.length ==0||name.length >5)
            {
                this.tooltipHelper.showTooltip(this.UIDiv, nameInput, -40 ,"아이디는 공백일 수 없고, 5글자 이내여야 합니다.")
            }
        })

        nameInput.addEventListener("keydown", e=>
        {
            this.tooltipHelper.closeTooltip();
        })
    }
}
