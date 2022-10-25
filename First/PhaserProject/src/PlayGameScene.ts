import GameWall from "./GameObject/GameWall";
import { GameMode, GameOption } from "./GameObject/GameOption";
import Vector2 = Phaser.Math.Vector2;
import Player from "./GameObject/Player";
import SquareText from "./GameObject/SquareText";
import { GameTexts } from "./GameText";

interface Record{
    id:number;
    level:number;
    username:string;
    time:Date;
}

interface RecordListMsg
{
    rows:Record[];
    msg:string;
}

export class PlayGameScene extends Phaser.Scene
{
    leftSquare: GameWall;
    rightSquare: GameWall;
    leftWall: GameWall;
    rightWall: GameWall;

    player: Player;
    squareText: SquareText;
    playerTweenTargets: any[];

    levelText: SquareText;

    gameWidth: number = 0;
    gameHeight: number = 0;

    rotateTween: Phaser.Tweens.Tween;
    growTween: Phaser.Tweens.Tween;

    currentMode:number = GameMode.IDLE;

    infoGroup: Phaser.GameObjects.Group;
    locale:string;
    saveData:any;

    popupWindow:HTMLDivElement;
    recordList : Record[] = [];

    constructor()
    {
        super({key:"PlayGame"});
        this.popupWindow = document.querySelector("#popup") as HTMLDivElement;

        const nameInput : HTMLInputElement = this.popupWindow.querySelector(".name") as HTMLInputElement;

        this.popupWindow.querySelector(".btn")?.addEventListener("click", ()=>{
            //서버로 전송
            const username:string = nameInput.value;
            if(username == "") {
                alert("이름이 공백입니다.");
                return;
            }
            const level:number = this.saveData.level;

            let req: XMLHttpRequest = new XMLHttpRequest();
            req.open("POST", "http://localhost:9090/record");
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify({username, level}));

            this.popupWindow.classList.remove("on");
            this.time.addEvent({
                delay:1000,
                callback:()=>{
                    this.scene.start("PlayGame");
                }
            });
        });
        
        
        this.popupWindow.querySelector("#close")?.addEventListener("click", ()=>{
            this.popupWindow.classList.remove("on");
            this.time.addEvent({
                delay:200,
                callback:()=>{
                    this.scene.start("PlayGame");
                }
            });
        });
        
    }
    loadRankFromServer(): void
    {
        let req:XMLHttpRequest = new XMLHttpRequest();
        req.open("GET","http://localhost:9090/record");
        req.addEventListener("readystatechange",()=>
        {
            if(req.readyState == XMLHttpRequest.DONE)
            {
                this.recordList =[]
                const msg:RecordListMsg = JSON.parse(req.responseText);
                this.recordList = msg.rows;
            }
        })
        req.send();
    }
    create(): void 
    {
        this.locale = "en";
        this.gameWidth = this.game.config.width as number;
        this.gameHeight = this.game.config.height as number;
        let tintColor = Phaser.Utils.Array.GetRandom(GameOption.bgColors);
        this.cameras.main.setBackgroundColor(tintColor);

        let saveData = localStorage.getItem("save");
        
        if(saveData == null)
        {
            this.saveData = {level:1};
        }else {
            this.saveData = JSON.parse(saveData as string);
        }

        this.placeWalls();

        this.player = new Player(this, this.gameWidth * 0.5, -400, 'square');
        this.add.existing(this.player);
        this.squareText = new SquareText(this, this.player.x, this.player.y,
                            'myFont', this.saveData.level, 120, tintColor);
        this.add.existing(this.squareText);
        this.playerTweenTargets = [this.player, this.squareText];


        this.levelText = new SquareText(this, this.player.x, 50,
                            'myFont', `Level ${this.saveData.level}`, 180, 0xffffff);
        this.add.existing(this.levelText);

        this.updateLevel();

        this.input.on("pointerdown", this.grow, this);
        this.input.on("pointerup", this.stop, this);
        this.loadRankFromServer();
    }
    
    grow(): void 
    {
        if(this.currentMode == GameMode.WAITING)
        {
            this.currentMode = GameMode.GROWING;
            if(this.player.successful == 0)
            {
                this.infoGroup.toggleVisible();
            }

            this.growTween = this.tweens.add({
                targets:this.playerTweenTargets,
                scaleX:1,
                scaleY:1,
                duration:GameOption.growTime
            });
        }
    }
    stop(): void 
    {
        if(this.currentMode == GameMode.GROWING)
        {
            this.currentMode = GameMode.IDLE;
            this.rotateTween.stop();
            this.growTween.stop();

            this.tweens.add({
                targets: this.playerTweenTargets,
                angle:0,
                duration:300,
                ease: 'Cubic.easeOut',
                onComplete:() => {
                    if(this.player.displayWidth <= this.rightSquare.x - this.leftSquare.x){
                        //이건 아래로 빠지는 경우다.
                        this.tweens.add({
                            targets:this.playerTweenTargets,
                            y: this.gameHeight + this.player.displayHeight,
                            duration:600,
                            ease:'Cubic.easeIn',
                            onComplete: ()=>{
                                //여기서 게임오버 처리해줘야 한다.
                                
                                this.gameOver();
                            }
                        })
                    }else{
                        //어떻게든 걸치는 경우인데.
                        if(this.player.displayWidth <= this.rightWall.x - this.leftWall.x) {
                            //성공
                            this.fallAndBounce(true);
                        }else{
                            //실패
                            this.fallAndBounce(false);
                        }
                    }
                }
            });
        }
    }

    fallAndBounce(success: boolean): void {
        let destY:number = this.gameHeight 
                           - this.leftSquare.displayHeight
                           - this.player.displayHeight * 0.5;
        if(success)
        {
            //레벨링 디자인
            this.player.successful ++;
        }else {
            destY = this.gameHeight 
            - this.leftWall.displayHeight
            - this.leftSquare.displayHeight
            - this.player.displayHeight * 0.5;
        }
        this.tweens.add({
            targets:this.playerTweenTargets,
            y:destY,
            duration:600,
            ease:'Bounce.easeOut',
            onComplete:()=>{
                //땅에 떨어지고 난뒤의 내용
                if(!success) {
                    this.gameOver();
                }else {
                    this.levelText.setText(GameTexts.en.success); //1
                    this.time.addEvent({
                        delay:1000,
                        callback:()=>{
                            if(this.player.successful == this.saveData.level)
                            {
                                this.saveData.level++;
                                localStorage.setItem(
                                    "save", JSON.stringify(this.saveData));
                                this.scene.start('PlayGame');
                            }else {
                                this.squareText.setText(
                                    (this.saveData.level - this.player.successful) + "" );
                                this.levelText.setText(`Level ${this.saveData.level}`);//2
                                this.updateLevel();
                            }
                        }
                    });
                }
            }
        });
    }

    gameOver() : void 
    {
        this.levelText.setText(GameTexts.en.failure);
        this.popupWindow.classList.add("on");
        
        
    }

    placeWalls(): void
    {
        this.leftSquare = new GameWall(
            this, 0, this.gameHeight, 'base', new Vector2(1, 1));
        this.add.existing(this.leftSquare);
        this.rightSquare = new GameWall(
            this, this.gameWidth, this.gameHeight, "base", new Vector2(0, 1));
        this.add.existing(this.rightSquare);

        this.leftWall = new GameWall(
            this, 0, this.gameHeight - this.leftSquare.height, "top", 
            new Vector2(1, 1));
        this.add.existing(this.leftWall);
        this.rightWall = new GameWall(
            this, this.gameWidth, this.gameHeight - this.rightSquare.height, "top", 
            new Vector2(0, 1));
        this.add.existing(this.rightWall);
    }

    updateLevel(): void 
    {
        let holeWidth:number = 
            Phaser.Math.Between(GameOption.holeWidthRange[0], GameOption.holeWidthRange[1]);
        let wallWidth = 
            Phaser.Math.Between(GameOption.wallRange[0], GameOption.wallRange[1]);
        
        
        this.leftSquare.tweenTo((this.gameWidth - holeWidth ) * 0.5, 500);
        this.rightSquare.tweenTo((this.gameWidth + holeWidth ) * 0.5, 500);
        this.leftWall.tweenTo( (this.gameWidth - holeWidth) * 0.5 - wallWidth, 500);
        this.rightWall.tweenTo( (this.gameWidth + holeWidth) * 0.5 + wallWidth, 500);

        this.tweens.add({
            targets:this.playerTweenTargets,
            y: 150,
            scaleX:0.2,
            scaleY:0.2,
            angle:50,
            duration:500,
            ease: 'Cubic.easeOut',
            onComplete:() => {
                this.rotateTween = this.tweens.add({
                    targets:this.playerTweenTargets,
                    angle:40,
                    duration:300,
                    yoyo:true,
                    repeat:-1
                });
                if(this.player.successful == 0)
                    this.addInfo(holeWidth, wallWidth);
                this.currentMode = GameMode.WAITING;
            }
        });

    }

    addInfo(holeWidth:number, wallWidth:number) : void
    { 
        this.infoGroup = this.add.group();
        let targetSquare : Phaser.GameObjects.Sprite
             = this.add.sprite(this.gameWidth * 0.5, 
                            this.gameHeight - this.leftSquare.displayHeight,
                            'square');
        targetSquare.alpha = 0.3;
        targetSquare.displayWidth = holeWidth + wallWidth;
        targetSquare.displayHeight = holeWidth + wallWidth;
        targetSquare.setOrigin(0.5, 1);
        this.infoGroup.add(targetSquare);   

        let targetText = this.add.bitmapText(
            this.gameWidth * 0.5, 
            targetSquare.y - targetSquare.displayHeight - 20, 'myFont',
            GameTexts["en"].landHere, 48);
        targetText.setOrigin(0.5, 1);
        this.infoGroup.add(targetText);

        let holdText = this.add.bitmapText(
            this.gameWidth * 0.5, 
            250, 'myFont',
            GameTexts["en"].infoLines[0], 40);
        holdText.setOrigin(0.5, 0);
        this.infoGroup.add(holdText);

        let releaseText = this.add.bitmapText(
            this.gameWidth * 0.5, 
            300, 'myFont',
            GameTexts["en"].infoLines[1], 40);
        releaseText.setOrigin(0.5, 0);
        this.infoGroup.add(releaseText);

        for(let i = 0; i< this.recordList.length; i++)
        {
            let r:Record = this.recordList[i];
            let recordText = this.add.bitmapText(this.gameWidth*0.5, 350+i*30,'myFont',`${r.username} (${r.level}lv)`,20);

            recordText.setOrigin(0.5,0);
            this.infoGroup.add(recordText);
        }
    }
}