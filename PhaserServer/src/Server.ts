import Http, {Server} from 'http';
import Express, { Application, NextFunction, Request, Response } from 'express';
import Path from 'path';
import { ConPool } from './DB';
import { ResultSetHeader } from 'mysql2';

const App : Application = Express();

App.use(Express.static("public"));
App.use(Express.json());
App.use(Express.urlencoded({extended:true}));

App.all("/*",(req:Request, res:Response,next:NextFunction)=>
{ 
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Method","POST");
    res.header("Access-Control-Allow-Headers","Content-Type");
    next();
})

App.get("/ggm", (req:Request, res:Response) =>{
    let filePath: string = Path.join(__dirname, "..", "views", "index.html");
    res.sendFile(filePath);
});
App.get("/test", (req:Request, res:Response) =>{
    let filePath: string = Path.join(__dirname, "..", "views", "test.html");
    res.sendFile(filePath);
});

App.post("/record", async (req:Request, res:Response) =>{
    //post로 전송된 애는 body로
    //get으로 전송된 애는 query로
    let {username, level} = req.body;
    console.log(username, level);
    if(username === undefined || level === undefined){
        res.json({msg:"잘못된 요청입니다.", success:false});
        return;
    }
    let sql = "INSERT INTO scores(username, level, time) VALUES (?, ?, NOW())";
    //Sql injection
    try{
        let [result, error] : [ResultSetHeader, any] = await ConPool.query(sql, [username, level]);
        if(result.affectedRows == 1)
        {
            res.json({msg:"성공적으로 기록됨.", success:true});
        }else{
            res.json({msg:"DB오류로 기록되지 못함", success:false});
        }
    }catch(e)
    {
        console.log(e);
        res.json({msg:"서버 오류 발생", success: false});
    }   
    
});

const httpServer: Server = Http.createServer(App);
httpServer.listen(9090, () => {
    console.log(`Server is running on 9090 port`);
});