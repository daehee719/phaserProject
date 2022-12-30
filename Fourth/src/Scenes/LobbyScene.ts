import Phaser, { NONE } from "phaser";
import SocketManager from "../Core/SocketManager";
import TooltipHelper from "../Core/TooltipHelper";
import { ChangeTeam, CreateRoom, EnterRoom, RoomInfo, UserInfo } from "../Network/Protocol";
import RoomManager from "../Server/RoomManager";
import Session, { SessionTeam } from "../Server/Session";
import SessionManager from "../Server/SessionManager";

export default class LobbyScene extends Phaser.Scene
{
    UIDiv: HTMLDivElement;
    gameCanvas: HTMLCanvasElement;

    toolTip:TooltipHelper;

    listDiv : HTMLDivElement;
    redTeamDiv:HTMLDivElement;
    blueTeamDiv:HTMLDivElement;

    startBtn : HTMLButtonElement;
    constructor()
    {
        super({key:"Lobby"});

        SocketManager.Instance.addLobbyProtocol(this); //로비관련 소켓 프로토콜 더하기

        this.UIDiv = document.querySelector("#gameDiv") as HTMLDivElement;
        this.gameCanvas = document.querySelector("#theGame > canvas") as HTMLCanvasElement;

        this.toolTip = new TooltipHelper();

        this.listDiv = this.UIDiv.querySelector(".waiting-row > .user-list") as HTMLDivElement;
        this.redTeamDiv = document.querySelector(".team.red") as HTMLDivElement;
        this.blueTeamDiv = document.querySelector(".team.blue") as HTMLDivElement;
        this.startBtn = document.querySelector("#btnStart") as HTMLButtonElement;
        this.resizeUI(0);

        window.addEventListener("resize", ()=> this.resizeUI(20));
        this.setUpLoginPage();
        this.setUpLobbyPage(); //로비 페이지 이벤트 셋팅 (한번만)
        this.setUpRoomPage();
    }

    create():void 
    {
        const sky = this.add.image(0, 0, "bg_sky").setOrigin(0,0).setScale(4.5);

        
        this.startBtn.style.visibility = "hidden";
    }

    resizeUI(time:number):void 
    {
        setTimeout(()=>{
            const {width, height, marginLeft, marginTop} = this.gameCanvas.style;

            this.UIDiv.style.width = width;
            this.UIDiv.style.height = height;
            this.UIDiv.style.marginLeft = marginLeft;
            this.UIDiv.style.marginTop = marginTop;

            let pages = this.UIDiv.querySelectorAll("#pageContainer > div") as NodeListOf<HTMLDivElement>;
            pages.forEach( p => {
                p.style.width = width;
                p.style.height = height;
            });
        }, time);
    }

    //이 함수는 처음에 한번만 실행된다
    setUpLoginPage():void 
    {
        const nameInput = document.querySelector("#nameInput") as HTMLInputElement;
        const loginBtn = document.querySelector("#btnLogin") as HTMLButtonElement;
        const leaveBtn = document.querySelector("#btnLeave") as HTMLButtonElement;
        nameInput.addEventListener("keydown", e => {
            this.toolTip.closeTooltip(); //입력창에 뭔가 입력되면 툴팁 닫아라
        });

        loginBtn.addEventListener("click", e => {
            let name = nameInput.value.trim();
            if(name.length == 0 || name.length > 5 ) 
            {
                this.toolTip.showTooltip(this.UIDiv, nameInput, -40, "아이디는 공백일 수 없고 5글자 이내입니다.");
                return;
            }
            //여기에 name을 소켓을 통해 전송하는 로직 필요
            let data : UserInfo = {name, playerId:""};
            SocketManager.Instance.sendData("login_user", data);
        });

        leaveBtn.addEventListener("click",e=>
        {
            const pageContainer = this.UIDiv.querySelector("#pageContainer") as HTMLDivElement;
            pageContainer.style.left = "-100%";
            let name = nameInput.value.trim();
            let data : UserInfo = {name, playerId:""};
        })
    }

    gotoLobby(name:string):void 
    {
        const pageContainer = this.UIDiv.querySelector("#pageContainer") as HTMLDivElement;
        const nameSpan = this.UIDiv.querySelector("#lobbyPage > .info-row .name") as HTMLSpanElement;
        nameSpan.innerHTML = name;
        pageContainer.style.left = "-100%";
    }

    setUpLobbyPage():void 
    {
        const createBtn = document.querySelector("#btnCreate") as HTMLButtonElement;
        
        createBtn.addEventListener("click", e => {
            //원래는 여기서 방제목을 받기 위한 창을 디자인하고 띄워야 하지만...줜나 간단하게
            let roomName = prompt("방제목을 입력해주세요.");

            if(roomName == null || roomName.trim() == "")
            {
                alert("공백일 수 없어요");
                return;
            }
            let data: CreateRoom = {name:roomName as string, playerId:SocketManager.Instance.socket.id};
            SocketManager.Instance.sendData("create_room", data);
        });

        const refreshBtn = document.querySelector("#btnRefresh") as HTMLButtonElement;
        refreshBtn.addEventListener("click", e => {
            SocketManager.Instance.sendData("room_list", {});
        });
    }

    drawRoomList(list:RoomInfo[]):void 
    {
        const body = this.UIDiv.querySelector("#lobbyPage > .content-body") as HTMLDivElement;
        body.innerHTML = "";

        list.forEach(info => {
            let {name, userCnt, maxCnt, isPlaying, no} = info;
            let roomHTML = this.getRoomHTML(name, userCnt, maxCnt, isPlaying);
            roomHTML.addEventListener("click",e=>{
                //console.log(no);
                let enterRoom : EnterRoom = {roomNo:no};
                SocketManager.Instance.sendData("enter_room",enterRoom);
            })
            body.appendChild(roomHTML);
        });
    }

    getRoomHTML(name:string, userCnt:number, maxCnt:number, isPlaying:boolean): HTMLDivElement
    {
        let div = document.createElement("div");
        div.innerHTML = `
        <div class="room">
            <div class="name">${name}</div>
            <div class="light">
                <div class="circle ${isPlaying == false ? "green" : "red"}"></div>
            </div>
            <div class="count-box">
                <span class="current">${userCnt}</span> /
                <span class="total">${maxCnt}</span>
            </div>
        </div>`;
        return div.firstElementChild as HTMLDivElement;
    }

    goToRoom(roomInfo:RoomInfo):void 
    {
        const pageContainer = this.UIDiv.querySelector("#pageContainer") as HTMLDivElement;
        pageContainer.style.left = "-200%";
        //여기에 roomInfo에 있는 유저리스트를  싹다 그려주는 기능이 있어야 한다.
        console.log(roomInfo);

        this.listDiv.innerHTML ="";
        roomInfo.userList.forEach(u=>
            {
                this.createUser(u)
            })
    }

    createUser(u :UserInfo):void
    {
        let userHTML = this.getUserHTML(u.name, u.playerId);
        if(u.team == SessionTeam.NONE)
        {
            this.listDiv.appendChild(userHTML);
        }
        else if(u.team == SessionTeam.RED)
        {
            this.redTeamDiv.appendChild(userHTML);
        }
        else
        {
            this.blueTeamDiv.appendChild(userHTML);
        }
        let readyDiv = userHTML.querySelector(".ready") as HTMLDivElement;
        if(u.isReady)
        {
            readyDiv.classList.add("on");
        }
        else
        {
            readyDiv.classList.remove("on");
        }
        userHTML.addEventListener("click",e=>
        {
            e.stopPropagation();
            if(userHTML.classList.contains("my"))
            {
                SocketManager.Instance.sendData("user_ready",u);
            }
        })
    }

    removeUserHTML(u :UserInfo):void
    {
        let target = this.UIDiv.querySelector(`[data-id='${u.playerId}']`) as HTMLDivElement;
        target.remove();
    }

    getUserHTML(name:string, playerID:string):HTMLDivElement
    {
        let div = document.createElement("div");
        div.innerHTML = `
        <div data-id="${playerID}" class="user ${playerID == SocketManager.Instance.socket.id? "my":""}">
            <div class="name">${name}</div>
            <div class="ready">Ready</div>
        </div>`
        return div.firstElementChild as HTMLDivElement;
    }

    setUpRoomPage():void
    {
        this.redTeamDiv.addEventListener("click",e=>
        {
            const me = this.UIDiv.querySelector(".my") as HTMLDivElement;

            let requestTeam : ChangeTeam = {plyaerID: SocketManager.Instance.socket.id, team:SessionTeam.RED}

            SocketManager.Instance.sendData("request_team",requestTeam);
            //redTeamDiv.querySelector(".list")?.appendChild(me);
        })
        this.blueTeamDiv.addEventListener("click",e=>
        {
            const me = this.UIDiv.querySelector(".my") as HTMLDivElement;
            let requestTeam : ChangeTeam = {plyaerID: SocketManager.Instance.socket.id, team:SessionTeam.BLUE}

            SocketManager.Instance.sendData("request_team",requestTeam);
            //blueTeamDiv.querySelector(".list")?.appendChild(me);
        })
    }
    
    addRoomUser(user : UserInfo):void
    {
        this.createUser(user);
    }

    changeTeam(data : ChangeTeam):void
    {
        let target = this.UIDiv.querySelector(`[data-id='${data.plyaerID}']`) as HTMLDivElement;
        if(data.team == SessionTeam.BLUE)
        {
            document.querySelector(".team.blue > .list")?.appendChild(target);
        } 
        else if(data.team == SessionTeam.RED)
        {
            document.querySelector(".team.red > .list")?.appendChild(target);
        }
    }

    userReady(user : UserInfo):void
    {
        let target = this.UIDiv.querySelector(`[data-id='${user.playerId}']`) as HTMLDivElement;
        let readyDiv = target.querySelector(".ready") as HTMLDivElement;
        if(user.isReady)
        {
            readyDiv.classList.add("on");
        }
        else
        {
            readyDiv.classList.remove("on");
        }
    }

    setRoomReady(ready : boolean):void
    {
        this.startBtn.style.visibility = ready?"visible":"hidden";
    }
}