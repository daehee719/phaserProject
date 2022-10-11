import Http,{Server} from 'http';
import Express,{Application} from 'express';
import Path from 'path';
import { ConPool } from './db';
import { ResultSetHeader } from 'mysql2';
const App : Application = Express();
App.use(Express.static("public"))
App.get("/ggm",(req,res)=>
{
    let filePath : string = Path.join(__dirname,"..","views","index.html");
    res.sendFile(filePath);
})

App.get("/record",async (req,res)=>
{
    let {username, level} = req.query;
    let sql = "INSERT INTO scores(username, level, time) VALUES (?,?,NOW())";
    try
    {
        let [result, error] : [ResultSetHeader,any] 
        = await ConPool.query(sql,[username,level]);
        if(result.affectedRows == 1)
        {
            res.json({msg:"성공적으로 기록됨."});
        }
        else
        {
            res.json({msg:"DB오류로 기록되지 못함."});
        }
    }
    catch(e)
    {
        console.log(e);
        res.json({msg:"서버 오류 발생",success : false});
    }
})

const httpServer : Server = App.listen(9090,()=>
{
    console.log(`Server is running on 9090 port`);
})