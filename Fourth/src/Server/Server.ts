import Http from 'http'
import Express, {Application, Request, response} from 'express'
import Path from 'path'
import FS from 'fs'
import {Server, Socket} from 'socket.io';
import { Position } from '../Network/Protocol';

//세션맵을 만들어서 연결하는 사람들을 세션으로 만들어서 맵에 넣는다
//연결을 종료하면 맵에서 빼준다.
//이동을 동기화 한다.

//익스프레스 웹 엔진을 만들어주고
const app: Application = Express();

app.use(Express.static("public"));

//맵정보 리딩파트
const spawnPoints: Position[] = [];
const mapPath: string = Path.join(__dirname, "..", "assets", "level1_stage.json" );
if(FS.existsSync(mapPath)) {
    let mapJson = FS.readFileSync(mapPath);
    let json = JSON.parse(mapJson.toString());
    
    for(let i = 0; i < json.layers[3].objects.length; i++){
        let obj = json.layers[3].objects[i];
        spawnPoints.push({x:obj.x, y:obj.y});
    }
    
    console.log(spawnPoints);
}else {
    console.error("맵파일이 존재하지 않습니다.");
}
//end of 맵 정보 리딩 파트

//엔진을 기반으로 서버를 만들어준다.
const server = Http.createServer(app);
//익스프레스로 만들어진 웹서버에다가 소켓서버를 붙여서 만들어주는거
const io =  new Server(server);

//io는 서버의 소켓이다.
io.on("connection", (socket: Socket) => {
    //여기의 socket은 클라이언트와 연결되는 서버의 소켓이다.
    console.log(socket.id);
    
    //socket.emit("ggm", {msg:"Hello", code:1});
    socket.on("enter", data => {
        let posIndex : number = Math.floor(Math.random()*spawnPoints.length)

        let pos = spawnPoints[posIndex];
        socket.emit("position", pos);
    });
});

server.listen(50000, ()=>{
    console.log(`Server is running on 50000 port`);
});
