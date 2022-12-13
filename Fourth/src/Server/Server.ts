import Http from 'http'
import Express, {Application, Request, Response} from 'express'
import Path from 'path'
import {Server, Socket} from 'socket.io';
import Session from './Session';
import { addServerListener } from '../Network/ServerListener';
import ServerMapManager from './ServerMapManager';
import SessionManager from './SessionManager';
import JobTimer from './JobTimer';
import RoomManager from './RoomManager';

//익스프레스 웹 엔진을 만들어주고
const app: Application = Express();
 
app.use(Express.static("public"));

//맵정보 리딩파트
const mapPath: string = Path.join(__dirname, "..", "assets", "level1_stage.json" );
ServerMapManager.Instance = new ServerMapManager(mapPath);
SessionManager.Instance = new SessionManager();
//end of 맵 정보 리딩 파트
 
RoomManager.Instance = new RoomManager(); 

RoomManager.Instance.createRoom("더미방 1");
RoomManager.Instance.createRoom("더미방 2");

//엔진을 기반으로 서버를 만들어준다.
const server = Http.createServer(app);
//익스프레스로 만들어진 웹서버에다가 소켓서버를 붙여서 만들어주는거
const io =  new Server(server);


// 세션맵을 만들어서 연결하는 사람들을 세션으로 만들어서 맵에 넣는다.
// 연결을 종료하면 맵에서 빼준다.
// 이동을 동기화한다.

//io는 서버의 소켓이다.
io.on("connection", (socket: Socket) => {
    console.log(`${socket.id} 님이 로그인`);
    let session:Session = new Session(socket); //해당 소켓에 세션을 만들고
    SessionManager.Instance.addSession(socket.id, session);

    //해당 소켓에 이벤트 리스너를 등록한다.
    addServerListener(socket, session);
    
    
}); 

server.listen(50000, ()=>{
    console.log(`Server is running on 50000 port`);
});

app.get("/monitor",(req:Request,res:Response)=>
{
    let list = SessionManager.Instance.getAllSessionInfo();
    res.json(list);
});

// let infoSyncTimer:JobTimer = new JobTimer(50, ()=>
// {
//     let list = SessionManager.Instance.getAllSessionInfo();
//     SessionManager.Instance.broadcast("info_sync",{list},"none",false);
// });
// infoSyncTimer.startTimer();